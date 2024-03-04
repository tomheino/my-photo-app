import { Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
    constructor(@InjectRepository(Profile) private profilesRepository: Repository<Profile>) {}

    async insertProfile(gender: string, photo: string) {
        const profile = new Profile();
        profile.gender = gender;
        profile.photo = photo;
        console.log(`saving profile: ${JSON.stringify(profile)}`)
        return await this.profilesRepository.save(profile);
    }

}
