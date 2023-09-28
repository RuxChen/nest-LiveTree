import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto, LikePostDto, QueryPostDto } from './dto/post.dto';
import { PostsService, PostsRo } from './posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 200, type: CreatePostDto })
  @Post()
  async create(@Body() post: CreatePostDto, @Req() req) {
    return await this.postsService.create(post, req);
  }

  /**
   * 获取所有文章
   */
  @Post('/getPostList')
  async find(@Body() query: QueryPostDto) {
    return await this.postsService.find(query);
  }

  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '点赞文章' })
  @Post('/likeById')
  async likeById(@Body() post: LikePostDto, @Req() req) {
    // console.log('likeById Service', req);
    return await this.postsService.likeById(post.id);
  }

  /**
   * 获取指定文章
   * @param id
   */
  @Get(':id')
  async findById(@Param('id') id) {
    return await this.postsService.findById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param post
   */
  @Put(':id')
  async update(@Param('id') id, @Body() post) {
    return await this.postsService.updateById(id, post);
  }

  /**
   * 删除
   * @param id
   */
  @Delete('id')
  async remove(@Param('id') id) {
    return await this.postsService.remove(id);
  }
}
