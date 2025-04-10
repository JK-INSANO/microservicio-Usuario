import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from './refresh-token.model';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async create(refreshTokenData: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const newRefreshToken = new this.refreshTokenModel(refreshTokenData);
    return newRefreshToken.save();
  }

  async findByToken(token: string): Promise<RefreshTokenDocument | null> {
    return this.refreshTokenModel.findOne({ 
      token, 
      revoked: false,
      expiresAt: { $gt: new Date() }
    }).exec();
  }

  async revokeToken(token: string): Promise<boolean> {
    const result = await this.refreshTokenModel.updateOne(
      { token },
      { revoked: true }
    ).exec();
    
    return result.modifiedCount > 0;
  }

  async revokeAllUserTokens(userId: string): Promise<boolean> {
    const result = await this.refreshTokenModel.updateMany(
      { userId },
      { revoked: true }
    ).exec();
    
    return result.modifiedCount > 0;
  }
}
