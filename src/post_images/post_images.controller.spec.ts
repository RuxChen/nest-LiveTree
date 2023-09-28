import { Test, TestingModule } from '@nestjs/testing';
import { PostImagesController } from './post_images.controller';
import { PostImagesService } from './post_images.service';

describe('PostImagesController', () => {
  let controller: PostImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostImagesController],
      providers: [PostImagesService],
    }).compile();

    controller = module.get<PostImagesController>(PostImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
