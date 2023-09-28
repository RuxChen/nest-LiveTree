import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostImagesService } from './post_images.service';
import { CreatePostImageDto } from './dto/create-post_image.dto';

@Controller('post-images')
export class PostImagesController {
  constructor(private readonly postImagesService: PostImagesService) {}

  @Post()
  create(@Body() createPostImageDto: CreatePostImageDto) {
    return this.postImagesService.create(createPostImageDto);
  }
}
