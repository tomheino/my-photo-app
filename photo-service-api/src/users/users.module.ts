import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { PhotosModule } from 'src/photos/photos.module';
import { PhotosService } from 'src/photos/photos.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfilesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
