import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { HttpException, Injectable, HttpStatus, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto';
import { RedisCacheService } from 'src/db/redis-cache.service';
import { Cron } from '@nestjs/schedule';
import { PostImagesService } from 'src/post_images/post_images.service';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly redisCacheService: RedisCacheService,
    private postImageService: PostImagesService,
    private authService: AuthService,
    private userService: UserService,
  ) {}
  private readonly logger = new Logger(PostsService.name);
  // 创建文章
  async create(post: CreatePostDto, req): Promise<number> {
    const { title, content, postImgs } = post;

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const userInfo = await this.authService.getUserByToken(token);
    console.log('create', post, token, userInfo);
    const postUser = await this.userService.findByUserId(userInfo.user_id);
    console.log('postUser', postUser);
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }

    // const { status } = post;
    const postParam: Partial<PostsEntity> = {
      title,
      content,
    };

    // 判断状态，为publish则设置发布时间
    // if (status === 'publish') {
    //   Object.assign(postParam, {
    //     publishTime: new Date(),
    //   });
    // }
    const newPost: PostsEntity = await this.postsRepository.create({
      ...postParam,
      author: postUser,
    });
    // newPost.author = postUser;
    const created = await this.postsRepository.save(newPost);

    await this.postImageService.savePostImage(postImgs, newPost);

    return created.id;
    // return 1;
  }

  // 获取文章列表
  async find(query): Promise<PostsRo> {
    console.log('query', query);

    const qb = await this.postsRepository.createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  // 获取指定文章
  async findById(id): Promise<PostsEntity> {
    return await this.postsRepository.findOne(id);
  }

  /// 点赞文章
  async likeById(id): Promise<number> {
    const qb = await this.postsRepository
      .createQueryBuilder('post')
      .where('post.id=:id')
      .setParameter('id', id);

    const result = await qb.getOne();
    if (!result)
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    const cacheLike = await this.redisCacheService.cacheGet(`postLike`);
    console.log('...like by id:', id, result);
    if (!cacheLike) {
      await this.redisCacheService.cacheSet(
        `postLike`,
        {
          post_id: id,
          count: result.likeCount + 1,
        },
        180,
      );
    }
    await this.redisCacheService.cacheSet(
      `postLike`,
      {
        post_id: id,
        count: cacheLike.count + 1,
      },
      180,
    );
    console.log('...like by id:', id, result);
    return result.likeCount;
  }
  // 更新文章
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 刪除文章
  async remove(id) {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
  @Cron('45 * * * * *')
  async handleCron() {
    console.log('定时任务');
    const cacheLike = await this.redisCacheService.cacheGet(`postLike`);

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'user')
      .where('post.id=:id')
      .setParameter('id', cacheLike.post_id);

    const result = await qb.getOne();

    console.log('ccc', cacheLike);
    await this.postsRepository.update(cacheLike.post_id, {
      likeCount: cacheLike.count,
    });
    return result;
  }
}
