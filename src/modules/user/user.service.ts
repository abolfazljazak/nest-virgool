import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { ChangeUsernameDto, ProfileDto } from "./dto/profile.dto";
import { ApiBadGatewayResponse } from "@nestjs/swagger";
import { isDate } from "class-validator";
import { Gender } from "./enums/gender.enum";
import { ProfileImages } from "./types/files";
import {
  AuthMessage,
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from "@common/enum/message.enum";
import { AuthService } from "../auth/auth.service";
import { TokenService } from "../auth/tokens.service";
import { OtpEntity } from "./entities/otp.entity";
import { CookieKeys } from "@common/enum/cookie.enum";
import { AuthMethod } from "../auth/enums/method.enum";
import { FollowEntity } from "./entities/follow.entity";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
    if (files?.image_profile?.length > 0) {
      let [image] = files.image_profile;
      profileDto.image_profile = image?.path.slice(7);
    }
    if (files?.bg_image?.length > 0) {
      let [image] = files?.bg_image;
      profileDto.bg_image = image?.path.slice(7);
    }
    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const {
      bio,
      birthday,
      gender,
      linkedIn,
      nick_name,
      x_profile,
      image_profile,
      bg_image,
    } = profileDto;
    if (!profile) {
      if (bio) profile.bio = bio;
      if (nick_name) profile.nick_name = nick_name;
      if (birthday && isDate(new Date(birthday)))
        profile.birthday = new Date(birthday);
      if (gender && Object.values(Gender as any).includes(gender))
        profile.gender = gender;
      if (linkedIn) profile.linkedIn = linkedIn;
      if (x_profile) profile.x_profile = x_profile;
      if (image_profile) profile.image_profile = image_profile;
      if (bg_image) profile.bg_image = bg_image;
    } else {
      this.profileRepository.create({
        bio,
        birthday,
        gender,
        linkedIn,
        nick_name,
        x_profile,
        userId,
      });
    }
    await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id }
      );
    }

    return {
      message: PublicMessage.Updated,
    };
  }

  profile() {
    const { id } = this.request.user;
    return this.userRepository.findOne({
      where: { id },
      relations: ["profile"],
    });
  }

  find() {
    return this.userRepository.find();
  }

  async changeEmail(email: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ email });
    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.Email);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update(
      { id },
      {
        new_email: email,
      }
    );
    const otp = await this.authService.saveOtp(id, AuthMethod.Email);
    const token = this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.EmailOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { email } = this.tokenService.verifyEmailToken(token);
    const otp = await this.checkOtp(userId, code);
    if (email !== new_email)
      throw new BadRequestException(BadRequestMessage.SometingWrong);
    if (otp.method !== AuthMethod.Email)
      throw new BadRequestException(BadRequestMessage.SometingWrong);
    await this.userRepository.update(
      { id: userId },
      {
        email,
        verify_email: true,
        new_email: null,
      }
    );
    return {
      message: PublicMessage.Updated,
    };
  }

  async changePhone(phone: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ phone });
    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.Phone);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update(
      { id },
      {
        new_phone: phone,
      }
    );
    const otp = await this.authService.saveOtp(id, AuthMethod.Phone);
    const token = this.tokenService.createPhoneToken({ phone });
    return {
      code: otp.code,
      token,
    };
  }

  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.PhoneOTP];
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { phone } = this.tokenService.verifyPhoneToken(token);
    const otp = await this.checkOtp(userId, code);
    if (phone !== new_phone)
      throw new BadRequestException(BadRequestMessage.SometingWrong);
    if (otp.method !== AuthMethod.Email)
      throw new BadRequestException(BadRequestMessage.SometingWrong);
    await this.userRepository.update(
      { id: userId },
      {
        phone,
        verify_phone: true,
        new_phone: null,
      }
    );
    return {
      message: PublicMessage.Updated,
    };
  }

  async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ username });
    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.Username);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }
    await this.userRepository.update({ id }, { username });
    return {
      message: PublicMessage.Updated,
    };
  }

  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException(NotFoundMessage.NotFound);
    if (otp.expriseIn < new Date())
      throw new BadRequestException(AuthMessage.ExpiredCode);
    if (otp.code !== code) throw new BadRequestException(AuthMessage.TryAgain);
    return otp;
  }

  async followToggle(followingId: number) {
    const { id: userId } = this.request.user;
    const following = await this.userRepository.findOneBy({ id: followingId });
    if (!following) throw new NotFoundException(NotFoundMessage.NotFoundUser);
    const isFollowing = await this.followRepository.findOneBy({
      followerId: userId,
      followingId,
    });
    let message = null;
    if (isFollowing) {
      message = PublicMessage.UnFollow
      await this.followRepository.remove(isFollowing);
    } else {
      message = PublicMessage.Follow
      await this.followRepository.insert({
        followingId,
        followerId: userId,
      });
    }
    return {
      message
    }
  }
}
