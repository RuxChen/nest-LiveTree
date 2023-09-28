import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    default: 0,
  })
  pid: number;

  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 50,
  })
  component: string;

  @Column({
    length: 50,
  })
  title: string;

  @Column({
    length: 50,
    default: '',
  })
  activeMenu: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @CreateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Role, (role) => role.menus)
  roles: Role[];
}
