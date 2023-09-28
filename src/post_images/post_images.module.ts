import { Module } from '@nestjs/common';
import { PostImagesService } from './post_images.service';
import { PostImagesController } from './post_images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './entities/post_image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage])],
  controllers: [PostImagesController],
  providers: [PostImagesService],
  exports: [PostImagesService],
})
export class PostImagesModule {}
