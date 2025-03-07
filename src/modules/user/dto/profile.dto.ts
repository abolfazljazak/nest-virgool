import { ApiPropertyOptional } from "@nestjs/swagger";

export class ProfileDto {
  @ApiPropertyOptional ()
  nick_name: string;

  @ApiPropertyOptional({ nullable: true })
  bio: string;

  @ApiPropertyOptional({ nullable: true })
  image_profile: string;

  @ApiPropertyOptional({ nullable: true })
  bg_image: string;

  @ApiPropertyOptional({ nullable: true })
  gender: string;

  @ApiPropertyOptional({ nullable: true })
  birthday: Date;

  @ApiPropertyOptional({ nullable: true })
  linkedIn: string;

  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
}
