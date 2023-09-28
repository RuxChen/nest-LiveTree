import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuService } from 'src/menu/menu.service';

export interface RoleRo {
  list: Role[];
  count: number;
}

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private menuService: MenuService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const newRole = await this.roleRepository.create(createRoleDto);

    return await this.roleRepository.save(newRole);
  }

  async findAll(query): Promise<RoleRo> {
    const qb = await this.roleRepository.createQueryBuilder('role');
    // qb.where('1 = 1');
    qb.orderBy('role.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const roles = await qb.getMany();
    return { list: roles, count: count };
  }

  async getRolePermission(role_id) {
    const permission = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.menus', 'menu')
      // .where('role.id = :id', { id: 2 })
      .setParameter('id', role_id.role_id)
      .getOne();
    const allMenus = await this.menuService.getAllMenus();
    const menuIds = [];
    permission.menus.forEach((val) => {
      menuIds.push(val.id);
    });
    permission.menus = menuIds;
    console.log('getRolePermission role_id', role_id.role_id);
    console.log('getRolePermission allMenus', allMenus);
    console.log('getRolePermission menuIds', menuIds);
    return { ...permission, allMenus: allMenus };
  }

  async setRolePermission(role_permission) {
    console.log('getRolePermission role_id', role_permission);
    const menuList = [];
    for await (const menuId of role_permission.menu_id_list) {
      const menu = await this.menuService.findById(menuId);
      console.log('menu', menu);
      menu ? menuList.push(menu) : '';
    }
    console.log('getRolePermission menuList', menuList);

    const role = await this.findByRoleId(role_permission.id);
    role.menus = menuList;
    await this.roleRepository.save(role);

    return {};
  }

  async findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async findByRoleId(id: number) {
    return await this.roleRepository.findOne({ where: { id } });
  }

  async update(roleKey: string, updateRoleDto: UpdateRoleDto) {
    console.log('update roleKey', roleKey);
    console.log('update updateRoleDto', updateRoleDto);
    return await this.roleRepository.save(updateRoleDto);
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
