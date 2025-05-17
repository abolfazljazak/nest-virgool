import { ApiProperty } from "@nestjs/swagger";

export class ImageDto {
  @ApiProperty({ format: "binary" })
  image: string;
}
