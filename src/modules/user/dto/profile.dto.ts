import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Gender } from "../enums/gender.enum";
import { ValidationMessage } from "@common/enum/message.enum";

export class ProfileDto {
  @ApiPropertyOptional()
  @Length(5, 100)
  @IsOptional()
  nick_name: string;

  @Length(10, 200)
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  bio: string;

  @ApiPropertyOptional({ nullable: true, format: "binary" })
  image_profile: string;

  @ApiPropertyOptional({ nullable: true, format: "binary" })
  bg_image: string;

  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender: string;

  @ApiPropertyOptional({ nullable: true, example: "2004-03-10T21:38:06.879Z" })
  birthday: Date;

  @ApiPropertyOptional({ nullable: true })
  linkedIn: string;

  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: ValidationMessage.InvalidEmailFormat })
  email: string;
}

export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhoneFormat })
  phone: string;
}

export class ChangeUsernameDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string
}
