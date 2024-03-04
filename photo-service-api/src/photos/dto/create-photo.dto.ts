// import { ApiProperty } from "@nestjs/swagger";
// import { IsNotEmpty, IsString } from "class-validator";

// export class CreatePhotoDto {
//     @ApiProperty()
//     @IsNotEmpty()
//     @IsString()
//     name: string;
//     @ApiProperty()
//     @IsNotEmpty()
//     @IsString()
//     description: string;
//     @ApiProperty()
//     @IsNotEmpty()
//     @IsString()
//     url: string;
//     @ApiProperty()
//     @IsString()
//     username: string;
//     @ApiProperty()
//     categories: {
//         name: string;
//         description: string}[];
// }

import { CreateCategoryDto } from "src/categories/dto/create-category.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreatePhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: () => [CreateCategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  categories: CreateCategoryDto[];
}