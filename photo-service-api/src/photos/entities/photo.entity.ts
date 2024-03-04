import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty()
    @Column()
    url: string;

    // owner of the photo
    @ApiProperty()
    @ManyToOne(() => User, (user) => user.photos, {onDelete: 'CASCADE'})
    user: User;

    @ApiProperty()
    @ManyToMany(() => Category, (category) => category.photos, {cascade: true})
    @JoinTable()
    categories: Category[]
}