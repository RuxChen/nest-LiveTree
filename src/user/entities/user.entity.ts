import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/role/entities/role.entity';
import { PostsEntity } from 'src/posts/posts.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ default: 1 })
  dept_id: number;

  @Column({ length: 30, nullable: true })
  user_name: string;

  @Column({ length: 30, nullable: true })
  role_key: string;

  @Column({ default: null })
  nick_name: string;

  @Column({ default: null })
  user_type: number;

  @Column({ default: '' })
  open_id: string;

  @Column({ length: 30, default: '' })
  email: string;

  @Column({ length: 30, default: '' })
  phonenumber: string;

  @Column({ default: 1 })
  sex: number;

  @Column({ length: 256, default: null })
  avatar: string;

  @Exclude()
  @Column({ length: 30, nullable: true })
  password: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: 0 })
  del_flag: number;

  @Column({ length: 30, default: null })
  login_ip: string;

  @Column({
    name: 'login_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  login_date: Date;

  @Column({ name: 'create_by', length: 30, nullable: true })
  createBy: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_by',
    length: 30,
    nullable: true,
  })
  updateBy: string;

  @Exclude()
  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @Column({ length: 30, nullable: true })
  remark: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role_relation',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }],
  })
  roles: Role[];

  @OneToMany(() => PostsEntity, (post) => post.author)
  posts: PostsEntity[];
}
