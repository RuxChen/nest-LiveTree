import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WechatUserInfo } from '../auth/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RoleService } from './../role/role.service';

@Injectable()
export class UserService {
  constructor(
    private roleService: RoleService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerByWechat(userInfo) {
    const { nickname, open_id, avatar, sex } = userInfo;
    // console.log('nickname, open_id, avatar', nickname, open_id, avatar);
    const newUser = await this.userRepository.create({
      nick_name: nickname,
      open_id,
      avatar,
      user_type: 0,
      sex: sex,
    });
    // console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByOpenid(open_id: string) {
    return await this.userRepository.findOne({ where: { open_id } });
  }

  async findByPwd(user_name: string, password: string) {
    console.log('findByPwd', user_name, password);
    const user = await this.userRepository.findOne({ where: { user_name } });
    console.log('findByPwd user', user);
    if (!user) {
      throw new BadRequestException('用户不存在！');
    }

    if (user.password !== password) {
      throw new BadRequestException('用户密码错误，请重新输入！');
    }
    // const role = await this.roleService.findByRoleId(user.role_id);

    return user;
  }
  async findByUserId(user_id) {
    return await this.userRepository.findOne({ where: { user_id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
