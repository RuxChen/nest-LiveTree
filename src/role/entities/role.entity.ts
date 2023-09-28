import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Menu } from 'src/menu/entities/menu.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'role_name',
    length: 30,
    nullable: true,
  })
  roleName: string;

  @Column({
    name: 'role_key',
    default: null,
  })
  roleKey: string;

  @Column({
    name: 'role_sort',
    default: null,
  })
  roleSort: string;

  @Column({
    name: 'data_scope',
    length: 30,
    default: null,
  })
  dataScope: string;

  @Column({
    name: 'menu_check_strictly',
    length: 30,
    default: null,
  })
  menuCheckStrictly: string;

  @Column({
    name: 'dept_check_strictly',
    default: 1,
  })
  deptCheckStrictly: number;

  @Column({ default: 1 })
  status: number;

  @Column({
    name: 'del_flag',
    default: 0,
  })
  delFlag: number;

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

  @ManyToMany(() => Menu, (menu) => menu.roles)
  @JoinTable({
    name: 'role_menu_relation',
    joinColumns: [{ name: 'role_id' }],
    inverseJoinColumns: [{ name: 'menu_id' }],
  })
  menus: Menu[];
}
