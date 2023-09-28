import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostImage {
  @ApiProperty({ description: '图片所属发布id' })
  post_id: number;

  @ApiProperty({ description: '图片服务器地址' })
  url: string;

  @ApiProperty({ description: '图片名称' })
  name: string;
}

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '上传图片' })
  @Type(() => PostImage)
  postImgs: PostImage[];

  @ApiPropertyOptional({ description: '发布者id' })
  readonly userId: string;
}

export class LikePostDto {
  @ApiProperty({ description: '文章id' })
  @IsNotEmpty({ message: '文章id必填' })
  readonly id: number;
}

export class QueryPostDto {
  @ApiProperty({ description: '页码' })
  @IsNotEmpty({ message: '请输入页码' })
  readonly pageNum: number;

  @ApiProperty({ description: '页数' })
  @IsNotEmpty({ message: '请输入页数' })
  readonly pageSize: number;
}
