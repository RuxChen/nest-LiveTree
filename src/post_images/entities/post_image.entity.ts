import { Exclude } from 'class-transformer';
import { PostsEntity } from 'src/posts/posts.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post_image')
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120, default: '' })
  name: string;

  @Column({ length: 120, default: '' })
  url: string;

  //1
  @Exclude()
  @ManyToOne(() => PostsEntity, (post) => post.postImg)
  @JoinColumn({ name: 'post_id' })
  post: PostsEntity;
}
