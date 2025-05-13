import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { ProfileDto } from "./dto/profile.dto";
import { ApiBadGatewayResponse } from "@nestjs/swagger";
import { isDate } from "class-validator";
import { Gender } from "./enums/gender.enum";
import { ProfileImages } from "./types/files";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private request: Request
  ) {}

  async changeProfile(files: ProfileImages, profileDto: ProfileDto) {
    if (files?.image_profile?.length > 0) {
      let [image] = files.image_profile
      profileDto.image_profile = image?.path.slice(7)
    } 
    if (files?.bg_image?.length > 0) {
      let [image] = files?.bg_image
      profileDto.bg_image = image?.path.slice(7)
    } 
    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const { bio, birthday, gender, linkedIn, nick_name, x_profile, image_profile, bg_image } =
      profileDto;
    if (!profile) {
        if (bio) profile.bio = bio
        if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday) 
        if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender
        if (linkedIn) profile.linkedIn = linkedIn
        if (x_profile) profile.x_profile = x_profile
        if (image_profile) profile.image_profile = image_profile
        if (bg_image) profile.bg_image = bg_image
    } else {
      this.profileRepository.create({
        bio,
        birthday,
        gender,
        linkedIn,
        nick_name,
        x_profile,
        userId
      });
    }
    await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update(
        { id: userId },
        { profileId: profile.id }
      );
    }
  }

  profile() {
    const {id} = this.request.user;
    return this.userRepository.findOne({
      where: { id },
      relations: ["profile"]
    })
  }
}
