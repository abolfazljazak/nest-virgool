import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    text: string

    @ApiProperty()
    @IsNumberString()
    blogId: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    parentId: number
    
}