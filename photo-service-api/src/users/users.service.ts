import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserWithEmbeddedProfileDto } from './dto/create-user-with-embedded-profile.dto';
import { ProfilesService } from 'src/profiles/profiles.service';
import { UpdateUserWithEmbeddedProfileDto } from './dto/update-user-with-embedded-profile.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
        private readonly profilesService: ProfilesService) {}

    insertUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.username = createUserDto.username;
        user.password = createUserDto.password;
        // user.profile = ...
        return this.usersRepository.save(user);
    }
    async insertUserWithEmbeddedProfile(createUserWithEmbeddedProfileDto: CreateUserWithEmbeddedProfileDto): Promise<User> {
        const existingUser = await this.usersRepository.findOneBy({ username: createUserWithEmbeddedProfileDto.username });

        if (existingUser) {
          throw new ConflictException('Username already exists');
        }
        const profile = await this.profilesService.insertProfile(
            createUserWithEmbeddedProfileDto.profile.gender,
            createUserWithEmbeddedProfileDto.profile.photo
        );

        const user = new User();
        user.firstName = createUserWithEmbeddedProfileDto.firstName;
        user.lastName = createUserWithEmbeddedProfileDto.lastName;
        user.username = createUserWithEmbeddedProfileDto.username;
        user.password = createUserWithEmbeddedProfileDto.password;
        user.profile = profile;
        console.log(`saving ${JSON.stringify(user)}`);
        return this.usersRepository.save(user);
    }

    async getUsers(): Promise<User []> {
        return await this.usersRepository.find({relations: ["profile", "photos"]});
    }

    async findUserByUsername(username: string): Promise<User> {
        return await this.usersRepository.findOne({where: {username: username}});
    }

    async findUserById(id: string): Promise<User> {
        return await this.usersRepository.findOneBy({id: parseInt(id)});
    }

    async updateUserById(id: string, updateUserWithEmbeddedProfileDto: UpdateUserWithEmbeddedProfileDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({id: parseInt(id)});
        if (!user) {
          throw new NotFoundException('User not found');
        }
        if (updateUserWithEmbeddedProfileDto.profile) {
          const profile = await this.profilesService.insertProfile(
              updateUserWithEmbeddedProfileDto.profile.gender,
              updateUserWithEmbeddedProfileDto.profile.photo
          );
          user.profile = profile;
      }

        user.firstName = updateUserWithEmbeddedProfileDto.firstName || user.firstName;
        user.lastName = updateUserWithEmbeddedProfileDto.lastName || user.lastName;
        user.username = updateUserWithEmbeddedProfileDto.username || user.username;
        user.password = updateUserWithEmbeddedProfileDto.password || user.password;

        console.log(`updating ${JSON.stringify(user)}`);
         return this.usersRepository.save(user);
      }

      async deleteUserById(id: string): Promise<void> {
        const user = await this.usersRepository.findOneBy({id: parseInt(id)});
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        console.log(`deleting ${JSON.stringify(user)} and related photos.`);
          await this.usersRepository.remove(user);
        }
}
