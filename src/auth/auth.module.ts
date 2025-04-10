import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.model';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../mail/mail.module'; // Importa MailModule

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // En producción, usa variables de entorno
      signOptions: { expiresIn: '15m' }, // Expiración predeterminada para tokens de acceso
    }),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    MailModule, // Agrega MailModule aquí
  ],
  providers: [AuthService, RefreshTokenService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
