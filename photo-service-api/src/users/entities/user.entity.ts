import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photos/entities/photo.entity";
import { Profile } from "src/profiles/entities/profile.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({unique: true})
    username: string;

    @ApiProperty()
    @Column()
    password: string;

    @ApiProperty()
    @Column()
    firstName: string;

    @ApiProperty()
    @Column()
    lastName: string;

    @ApiProperty()
    @OneToOne(() => Profile, profile => profile.user)
    @JoinColumn()
    profile?: Profile;

    @ApiProperty()
    @OneToMany(() => Photo, (photo) => photo.user, {cascade: true})
    photos?: Photo[]
}