import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const newMenu = await this.menuRepository.create(createMenuDto);

    return await this.menuRepository.save(newMenu);
  }

  async getMenusByRoleId(role_id) {
    return await this.menuRepository.find({
      relations: ['role'],
      where: { id: role_id },
    });
  }

  getTree(arr, pid) {
    const res = [];
    arr.forEach((item) => {
      if (item.pid === pid) {
        this.getTree(arr, item.id).length > 0
          ? (item.children = this.getTree(arr, item.id))
          : '';
        res.push(item);
      }
    });
    return res;
  }

  async getAllMenus() {
    const menus = await this.menuRepository
      .createQueryBuilder('menu')
      .getMany();

    return this.getTree(menus, 0);
  }

  async findAll(query) {
    const qb = await this.menuRepository.createQueryBuilder('menu');
    // qb.where('1 = 1');
    qb.orderBy('menu.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const menus = await qb.getMany();
    return { list: this.getTree(menus, 0), count: count };
  }

  // 获取指定文章
  async findById(id: number): Promise<Menu> {
    return await this.menuRepository.findOne({ where: { id } });
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
