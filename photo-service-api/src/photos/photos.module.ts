import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { Photo } from './entities/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { forwardRef } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), UsersModule, CategoriesModule],  // mod add CategoriesModule
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],  // mod
})
export class PhotosModule {}
