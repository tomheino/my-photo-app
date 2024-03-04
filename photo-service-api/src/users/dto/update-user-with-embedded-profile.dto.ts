import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserWithEmbeddedProfileDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    profile: {
        gender: string;
        photo: string;
    }
}