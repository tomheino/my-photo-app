import { Module, forwardRef, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PhotosModule } from './photos/photos.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './cors.middleware'; // Import the CorsMiddleware


@Module({
  imports: [TypeOrmModule.forRoot({
    "type": "sqlite",
    "database": "database/photo-service.sq3",
    "entities": ["dist/**/**/*.entity{.ts,.js}"],
    "synchronize": true
  }), UsersModule, ProfilesModule, PhotosModule, CategoriesModule, AuthModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
