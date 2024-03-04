// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Photo } from './entities/photo.entity';
// import { Repository } from 'typeorm';
// import { CreatePhotoDto } from './dto/create-photo.dto';
// import { UsersService } from 'src/users/users.service';
// import { CategoriesService } from 'src/categories/categories.service';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { extname } from 'path';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Photo } from './entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { promisify } from 'util';
import { exists, mkdir } from 'fs';
import * as multer from 'multer';
import * as fsExtra from 'fs-extra';
import * as path from 'path';

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photo) private photosRepository: Repository<Photo>,
        private usersService: UsersService,
        private categoriesService: CategoriesService,
    ) {}

    // async insertPhoto(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    //     const user = await this.usersService.findUserByUsername(createPhotoDto.username);

    //     if(!user) {
    //         throw new NotFoundException("User not found");
    //     }
    //     console.log(`insertPhoto user found ${user.username}`)

    //     const categoryPromises = createPhotoDto.categories?.map(async (categoryData) => {
    //       const existingCategory = await this.categoriesService.getCategoryByName(categoryData.name);
    
    //       if (existingCategory) {
    //         return existingCategory;
    //       } else {
    //         return this.categoriesService.insertCategory(categoryData);
    //       }
    //     });

    //     const categories = await Promise.all(categoryPromises);

    //     const photo = new Photo();
    //     photo.name = createPhotoDto.name;
    //     photo.description = createPhotoDto.description;
    //     photo.url = createPhotoDto.url;
    //     photo.user = user;
    //     photo.categories = categories;   // mod
    //     return await this.photosRepository.save(photo);
    // }

  //   async insertPhoto(createPhotoDto: CreatePhotoDto, file: Express.Multer.File): Promise<Photo> {
  //     const user = await this.usersService.findUserByUsername(createPhotoDto.username);

  //     if (!user) {
  //         throw new NotFoundException("User not found");
  //     }

  //     // Check if categories are provided and is an array
  //     if (createPhotoDto.categories && Array.isArray(createPhotoDto.categories)) {
  //         const categoryPromises = createPhotoDto.categories.map(async (categoryData) => {
  //             // Ensure each category has name and description properties
  //             if (!categoryData.name || !categoryData.description) {
  //                 throw new BadRequestException("Invalid category data");
  //             }

  //             const existingCategory = await this.categoriesService.getCategoryByName(categoryData.name);

  //             if (existingCategory) {
  //                 return existingCategory;
  //             } else {
  //                 return this.categoriesService.insertCategory(categoryData);
  //             }
  //         });

  //         const categories = await Promise.all(categoryPromises);

  //         // Define the destination directory to store uploaded photos
  //         const uploadDir = path.join(__dirname, '..', 'uploads');

  //         // Ensure the destination directory exists
  //         await fsExtra.ensureDir(uploadDir);

  //         // Generate a unique filename for the uploaded photo
  //         const filename = `${Date.now()}-${file.originalname}`;

  //         // Move the uploaded file to the destination directory
  //         await fsExtra.move(file.path, path.join(uploadDir, filename));

  //         // Construct the URL for the uploaded photo
  //         const url = `/uploads/${filename}`;

  //         const photo = new Photo();
  //         photo.name = createPhotoDto.name;
  //         photo.description = createPhotoDto.description;
  //         photo.url = url; // Store the relative path to the uploaded photo
  //         photo.user = user;
  //         photo.categories = categories;
  //         return await this.photosRepository.save(photo);
  //     } else {
  //         throw new BadRequestException("Categories are required and must be an array");
  //     }
  // }

async insertPhoto(createPhotoDto: CreatePhotoDto, filename: string): Promise<Photo> {
  const user = await this.usersService.findUserByUsername(createPhotoDto.username);
  if (!user) {
      throw new NotFoundException("User not found");
  }

  const uploadDir = path.join(__dirname, '..', 'uploads');
  await fsExtra.ensureDir(uploadDir);

  const filePath = path.join(uploadDir, filename);

  // Construct the URL using the filename passed from the controller
  const baseUrl = 'http://localhost:3000'; // Replace this with the actual base URL of your backend server
  const url = `${baseUrl}/uploads/${filename}`;
  
  const photo = new Photo();
  photo.name = createPhotoDto.name;
  photo.description = createPhotoDto.description;
  photo.url = url;
  photo.user = user;

  // Check if categories are provided and is an array
  if (createPhotoDto.categories && Array.isArray(createPhotoDto.categories)) {
      const categoryObjects = await Promise.all(
          createPhotoDto.categories.map(async (categoryData) => {
              if (!categoryData.name || !categoryData.description) {
                  throw new BadRequestException("Invalid category data");
              }
              let existingCategory = await this.categoriesService.getCategoryByName(categoryData.name);
              if (!existingCategory) {
                  existingCategory = await this.categoriesService.insertCategory(categoryData);
              }
              return existingCategory;
          })
      );
      photo.categories = categoryObjects;
  } else {
      // If no categories provided or it's not an array, set it to an empty array
      photo.categories = [];
  }

  // Parse the categories string back to an array of objects
  if (typeof createPhotoDto.categories === 'string') {
    photo.categories = JSON.parse(createPhotoDto.categories);
  }

  // Perform database insertion with the constructed photo object
  console.log(`adding photo: ${JSON.stringify(photo)}`);
  return await this.photosRepository.save(photo);
}




    async getPhotos(): Promise<Photo []> {
        return this.photosRepository.find({relations: ["user", "categories"]})
    }

    async getLatestPhotos(): Promise<Photo []> {
      return this.photosRepository
          .createQueryBuilder("photo")
          .orderBy("photo.id", "DESC")
          .take(10)
          .getMany();
  }

    // async findPhotoById(id: string): Promise<Photo> {
    //   return await this.photosRepository.findOneBy({id: parseInt(id), });
    // }
    async findPhotoById(id: string): Promise<Photo> {
      return await this.photosRepository.findOne({ where: { id: parseInt(id) }, relations: ["user", "categories"] });
    }
    
    
    

    async updatePhoto(id: string, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
      const photo = await this.photosRepository.findOneBy({ id: parseInt(id) });

      if (!photo) {
        throw new NotFoundException('Photo not found');
      }

      if (updatePhotoDto.name) {
        photo.name = updatePhotoDto.name;
      }

      if (updatePhotoDto.description) {
        photo.description = updatePhotoDto.description;
      }

      if (updatePhotoDto.url) {
        photo.url = updatePhotoDto.url;
      }

      if (updatePhotoDto.username) {
        const user = await this.usersService.findUserByUsername(updatePhotoDto.username);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        photo.user = user;
      }

      if (updatePhotoDto.categories) {
        const updatedCategories = await Promise.all(
            updatePhotoDto.categories.map(async (categoryData) => {
                const existingCategory = await this.categoriesService.getCategoryByName(categoryData.name);

                if (existingCategory) {
                    return existingCategory;
                } else {
                    return this.categoriesService.insertCategory(categoryData);
                }
            }),
        );
        photo.categories = updatedCategories;
      }
        console.log(`updating ${JSON.stringify(photo)}`);
        return this.photosRepository.save(photo);
    }   
    
      async deletePhotoById(id: string): Promise<void> {
        const photo = await this.photosRepository.findOneBy({id: parseInt(id)});
        if (!photo) {
          throw new NotFoundException('Photo not found');
        }
    
        await this.photosRepository.remove(photo);
      }
}
