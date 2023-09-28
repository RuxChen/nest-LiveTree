import { PartialType } from '@nestjs/swagger';
import { CreatePostImageDto } from './create-post_image.dto';

export class UpdatePostImageDto extends PartialType(CreatePostImageDto) {}
