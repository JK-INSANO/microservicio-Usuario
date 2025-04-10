import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/user.model';
import { RefreshTokenService } from './refresh-token.service';
import * as bcrypt from 'bcrypt';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Remove password from the returned user object
    const userObject = user.toObject ? user.toObject() : user;
    const { password: _, ...result } = userObject;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get the user ID as string
    const userId = user['_id'] ? user['_id'].toString() : user['id'];

    const payload: TokenPayload = {
      email: user.email,
      sub: userId,
      role: user.account_type
    };

    // Create access token (short-lived)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m', // 15 minutes
    });

    // Create refresh token (long-lived)
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' }, // 7 days
    );

    // Save refresh token to database
    await this.refreshTokenService.create({
      userId: userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      // Verify the refresh token
      const decoded = this.jwtService.verify(token);

      // Check if token exists in database and is not revoked
      const storedToken = await this.refreshTokenService.findByToken(token);
      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user information
      const user = await this.userService.findOne(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Create new access token
      const payload: TokenPayload = {
        email: user.email,
        sub: decoded.sub, // Use the sub from the decoded token
        role: user.account_type
      };

      return {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '15m',
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(token: string): Promise<boolean> {
    return this.refreshTokenService.revokeToken(token);
  }

  getProfile(user: UserDocument) {
    // Remove sensitive information
    const userObject = user.toObject ? user.toObject() : user;
    const { password, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }

  async register(createUserDto: CreateUserDto) {
    // Check if user with this email already exists
    const existingUser = await this.userService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Create the user
      const newUser = await this.userService.create(createUserDto);

      // Get the user ID as string
      const userId = newUser['_id'] ? newUser['_id'].toString() : newUser['id'];

      // Generate tokens just like in login
      const payload: TokenPayload = {
        email: newUser.email,
        sub: userId,
        role: newUser.account_type
      };

      // Create access token (short-lived)
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m', // 15 minutes
      });

      // Create refresh token (long-lived)
      const refreshToken = this.jwtService.sign(
        { sub: userId },
        { expiresIn: '7d' }, // 7 days
      );

      // Save refresh token to database
      await this.refreshTokenService.create({
        userId: userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      // Remove password from the returned user object
      const userObject = newUser.toObject ? newUser.toObject() : newUser;
      const { password, ...userWithoutPassword } = userObject;

      return {
        user: userWithoutPassword,
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      if (error.code === 11000) { // MongoDB duplicate key error
        throw new ConflictException('User with this email already exists');
      }
      throw new BadRequestException('Could not create user');
    }
  }
}
