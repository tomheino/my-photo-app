import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePhotoDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsString()
    description: string;
    @ApiProperty()
    @IsString()
    url: string;
    @ApiProperty()
    @IsString()
    username: string;
    @ApiProperty()
    categories: {
        name: string;
        description: string}[];
}