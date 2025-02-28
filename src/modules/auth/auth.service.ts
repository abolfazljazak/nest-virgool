import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthType } from "./enums/type.enum";
import { AuthMethod } from "./enums/method.enum";
import { isEmail, isMobilePhone } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "../user/entities/profile.entity";
import {
  AuthMessage,
  BadRequestMessage,
  PublicMessage,
} from "src/common/enum/message.enum";
import { OtpEntity } from "../user/entities/otp.entity";
import { randomInt } from "crypto";
import { TokenService } from "./tokens.service";
import { Request, Response } from "express";
import { CookieKeys } from "src/common/enum/cookie.enum";
import { AuthResponse } from "./types/response";
import { REQUEST } from "@nestjs/core";
import { throwError } from "rxjs";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async userExistence(authDto: AuthDto, res: Response) {
    const { type, username, method } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Register:
        result = await this.register(method, username);
        return this.sendResponse(res, result);

      case AuthType.Login:
        result = await this.login(method, username);
        return this.sendResponse(res, result);

      default:
        throw new UnauthorizedException();
    }
  }

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return {
      code: otp.code,
      token,
    };
  }

  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    let user: UserEntity = await this.checkExistUser(method, validUsername);
    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);
    user = this.userRepository.create({
      [method]: username,
    });
    user = await this.userRepository.save(user);
    user.username = `m_${user.id}`;
    await this.userRepository.save(user);
    const otp = await this.saveOtp(user.id);
    const token = this.tokenService.createOtpToken({ userId: user.id });
    return {
      code: otp.code,
      token,
    };
  }

  async sendResponse(res: Response, result: AuthResponse) {
    const { token, code } = result;
    res.cookie(CookieKeys.OTP, token, {
      httpOnly: true,
      expires: new Date(Date.now() + (1000 * 60 * 2)),
    });
    res.json({
      message: PublicMessage.sendOtp,
      code: code,
    });
  }

  async saveOtp(userId: number) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId: userId });
    let existOtp = false;
    if (otp) {
      existOtp = true;
      otp.code = code;
      otp.expriseIn = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code: code,
        expriseIn: expiresIn,
        userId: userId,
      });
    }

    otp = await this.otpRepository.save(otp);
    if (!existOtp) {
      await this.userRepository.update(
        { id: userId },
        {
          otpId: otp.id,
        }
      );
    }

    //Send [SMS, Email] Otp Code
    return otp;
  }

  async checkOtp(code: string) {
    const token = this.request.cookies?.[CookieKeys.OTP]
    if (token) throw new UnauthorizedException(AuthMessage.ExpiredCode)
    const {userId} = this.tokenService.verifyOtpToken(token)
    const otp = await this.otpRepository.findOneBy({userId})
    if (!otp) throw new UnauthorizedException(AuthMessage.LoginAgain)
    const now = new Date()
    if (otp.expriseIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode)
    if (otp.code !== code) throw new UnauthorizedException(AuthMessage.TryAgain)
    const accessToken = this.tokenService.createAccessToken({userId})

      return {
        message: PublicMessage.LoggedIn,
        accessToken: accessToken
      }
  }

  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity;
    if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({ email: username });
    } else if (method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({ phone: username });
    } else if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({ username });
    } else {
      throw new BadRequestException(BadRequestMessage.InValidLoginData);
    }
    return user;
  }

  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token)
    const user = await this.userRepository.findOneBy({id: userId})
    if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain)
    return user
  }    

  usernameValidator(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException("email format is incorrect");
      case AuthMethod.Phone:
        if (isMobilePhone(username, "fa-IR")) return username;
        throw new BadRequestException("mobile number is incorrect");
      case AuthMethod.Username:
        return username;
      default:
        throw new UnauthorizedException("username data is not valid");
    }
  }
}
