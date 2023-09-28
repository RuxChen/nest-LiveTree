import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';
import { RedisCacheService } from 'src/db/redis-cache.service';
import { PostImagesService } from 'src/post_images/post_images.service';
import { PostImage } from 'src/post_images/entities/post_image.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { MenuModule } from 'src/menu/menu.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity, PostImage]),
    HttpModule,
    PassportModule,
    UserModule,
    MenuModule,
    RoleModule,
    JwtModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, RedisCacheService, PostImagesService, AuthService],
  exports: [PostsService, PostImagesService],
})
export class PostsModule {}
