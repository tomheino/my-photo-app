import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { User } from './users/entities/user.entity';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express'; // Import express module

const swaggerInfo = {
  api_path: `/docs`,
  title: `Photos service API`,
  description: `Service API for photos.`,
  version: `0.9`,
  tag: ``
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true }); // Enable CORS

  const config = new DocumentBuilder()
    .setTitle(swaggerInfo.title)
    .setDescription(swaggerInfo.description)
    .setVersion(swaggerInfo.version)
    .addTag(swaggerInfo.tag)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerInfo.api_path, app, document);

  const usersService = app.get(UsersService);

  // Get all users
  const allUsers = await usersService.getUsers();

  // If users don't exist, create the admin user
  if (!allUsers || allUsers.length === 0) {
    const admin: CreateUserDto = {
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin@admin.com',
      password: 'Koodaus1',
    };

    const adminUser: User = await usersService.insertUser(admin);
    console.log('Admin user created successfully:', adminUser);
  }

  // Configure express middleware to serve static files
  app.use('/uploads', express.static('uploads'));

  await app.listen(3000);
}
bootstrap();
