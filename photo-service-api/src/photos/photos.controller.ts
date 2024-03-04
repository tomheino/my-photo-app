import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Photo } from './entities/photo.entity';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as multer from 'multer';



@Controller('photos')
@ApiTags('photos')

export class PhotosController {
    constructor(private photosService: PhotosService) {}
        
    // @Post('/manual')
    // @ApiOperation({summary: 'Add a new photo'})
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // async createPhotoUsingEmail(
    //     @Body() createPhotoDto: CreatePhotoDto
    // ): Promise<Photo> {
    //     return await this.photosService.insertPhoto(createPhotoDto);
    // }

    // @Post() // Add a route for uploading files
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: multer.diskStorage({
    //         destination: './uploads',
    //         filename: (req, file, callback) => {
    //             const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
    //             return callback(null, `${randomName}${extname(file.originalname)}`);
    //         }
    //     })
    // }))
    // async uploadFile(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() createPhotoDto: CreatePhotoDto,
    // ): Promise<any> {
    //     console.log('Uploaded file:', file);
    //     console.log('CreatePhotoDto:', createPhotoDto);
    
    //     // Construct the full URL for the uploaded photo
    //     const fullUrl = `http://localhost:3000/uploads/${file.filename}`;
    
    //     // Add the full URL to the createPhotoDto object
    //     createPhotoDto.url = fullUrl;
    
    //     // Save the photo data to the database using the service
    //     const savedPhoto = await this.photosService.insertPhoto(createPhotoDto, file);
    
    //     // Return the saved photo along with the full URL in the response
    //     return { photo: savedPhoto, url: fullUrl };
    // }
    



    
    // @Post() // Add a route for uploading files
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: multer.diskStorage({
    //         destination: './uploads',
    //         filename: (req, file, callback) => {
    //             // Generate a random filename
    //             const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
    //             // Get the file extension from the original filename
    //             const ext = extname(file.originalname);
    //             // Construct the new filename with the random name and original extension
    //             const newFilename = `${randomName}${ext}`;
    //             // Pass the new filename to the callback
    //             callback(null, newFilename);
    //         }
    //     })
    // }))
    // async uploadFile(
    //     @UploadedFile() file: Express.Multer.File, // Note: 'file' will be the uploaded file object
    //     @Body() createPhotoDto: CreatePhotoDto,
    // ): Promise<any> {
    //     console.log('Uploaded file:', file);
    //     console.log('CreatePhotoDto:', createPhotoDto);
    
    //     // Construct the full URL for the uploaded photo
    //     const fullUrl = `http://localhost:3000/uploads/${file.filename}`;
    
    //     // Save the photo data to the database using the service
    //     return await this.photosService.insertPhoto(createPhotoDto, file);
    // }


    @Post() // Add a route for uploading files
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
            // Generate a random filename
            const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
            // Get the file extension from the original filename
            const ext = extname(file.originalname);
            // Construct the new filename with the random name and original extension
            const newFilename = `${randomName}${ext}`;
            // Pass the new filename to the callback
            callback(null, newFilename);
        }
    })
}))
async uploadFile(
    @UploadedFile() file: Express.Multer.File, // Note: 'file' will be the uploaded file object
    @Body() createPhotoDto: CreatePhotoDto,
): Promise<any> {
    console.log('Uploaded file:', file);
    console.log('CreatePhotoDto:', createPhotoDto);

    // Construct the full URL for the uploaded photo
    const fullUrl = `http://localhost:3000/uploads/${file.filename}`;

    // Generate the filename here
    const filename = file.filename;

    // Save the photo data to the database using the service
    console.log(createPhotoDto, filename);

    return await this.photosService.insertPhoto(createPhotoDto, filename);
}




    @Get()
    @ApiOperation({summary: 'Get all Photos'})
    @ApiResponse({status: 200, description: 'OK'})
    async getPhotos(): Promise<Photo[]> {
        return await this.photosService.getPhotos();
    }

    @Get('/latest')
    @ApiOperation({summary: 'Get 10 latest Photos'})
    @ApiResponse({status: 200, description: 'OK'})
    async getLatestPhotos(): Promise<Photo[]> {
        return await this.photosService.getPhotos();
    }

    @Get(':id')
    @ApiOperation({summary: 'Get a Photo by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    async getPhotoById(@Param('id') id: string) {
        return await this.photosService.findPhotoById(id);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Update a Photo'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updatePhotoD(
        @Param('id') id: string,
        @Body() updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
        console.log(`updatePhoto: ${JSON.stringify(updatePhotoDto)}`)
        return await this.photosService.updatePhoto(id, updatePhotoDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete a Photo by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteUserById(@Param('id') id: string): Promise<{ message: string }> {
        console.log(`deletePhoto ID: ${JSON.stringify(id)}`)
        await this.photosService.deletePhotoById(id);
        return { message: 'Photo deleted successfully' };
    }
}

