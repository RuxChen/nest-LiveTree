import { Injectable } from '@nestjs/common';
import { CreatePostImageDto } from './dto/create-post_image.dto';
import { UpdatePostImageDto } from './dto/update-post_image.dto';
import { Repository } from 'typeorm';
import { PostImage } from './entities/post_image.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostImagesService {
  constructor(
    @InjectRepository(PostImage)
    private postImagesRepository: Repository<PostImage>,
  ) {}

  async create(post: CreatePostImageDto) {
    const { post_id, name, url } = post;
    const newImage = await this.postImagesRepository.create({
      name,
      url,
      post: { title: '', content: '' },
    });
    await this.postImagesRepository.save(newImage);
  }

  async savePostImage(imageList, post) {
    for await (const image of imageList) {
      const { name, url } = image;
      const newImage: PostImage = await this.postImagesRepository.create({
        name,
        url,
        post,
      });
      await this.postImagesRepository.save(newImage);
    }
  }
}
