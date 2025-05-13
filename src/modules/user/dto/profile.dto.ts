import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, Length } from "class-validator";
import { Gender } from "../enums/gender.enum";

export class ProfileDto {
  @ApiPropertyOptional()
  @Length(5,100)
  @IsOptional()
  nick_name: string;
  
  @Length(10,200)
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  bio: string;

  @ApiPropertyOptional({ nullable: true, format: 'binary' })
  image_profile: string;

  @ApiPropertyOptional({ nullable: true, format: 'binary' })
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
