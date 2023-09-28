import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { PostImage } from 'src/post_images/entities/post_image.entity';

@Entity('post')
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  @Column({ length: 50 })
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'int', default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ default: '' })
  thumb_url: string;

  @OneToMany(() => PostImage, (post_image) => post_image.post)
  postImg: PostImage[];

  @Column({ default: '' })
  status: string;

  @Column({ default: '' })
  location: string;

  // 作者
  @Exclude()
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  author: User;

  // @Column({ type: 'tinyint', default: 0, name: 'type' })
  // type: number;

  @Column({ type: 'timestamp', name: 'publish_time', default: null })
  publishTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
