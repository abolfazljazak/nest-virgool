import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { ProfileEntity } from '../user/entities/profile.entity';
import { KavenegarService } from '../http/kavenegar.service';
import { CustomHttpModule } from '../http/http.module';

@Module({
  imports: [
    CustomHttpModule,
    TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService, JwtService, TokenService, TypeOrmModule],
})
export class AuthModule {}
