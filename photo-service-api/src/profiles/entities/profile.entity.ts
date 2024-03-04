import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    gender: string;

    @ApiProperty()
    @Column()
    photo: string;

    @ApiProperty()
    @OneToOne(() => User, user => user.profile)
    user: User;
}