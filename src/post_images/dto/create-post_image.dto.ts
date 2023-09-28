import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostImageDto {
  @ApiProperty({ description: '图片名称' })
  readonly name: string;

  @ApiPropertyOptional({ description: '图片地址' })
  readonly url: string;

  @ApiPropertyOptional({ description: '图片所属发布id' })
  post_id: number;
}
