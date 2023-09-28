import { UserService } from './../user/user.service';
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { User } from '../user/entities/user.entity';

import {
  AccessTokenInfo,
  AccessConfig,
  WechatError,
  WechatUserInfo,
} from './auth.interface';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { RedisCacheService } from 'src/db/redis-cache.service';
import { MenuService } from 'src/menu/menu.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private menuService: MenuService,
    private httpService: HttpService,
    private roleService: RoleService,
    private redisCacheService: RedisCacheService,
  ) {}

  private sessionKeyInfo;
  public apiServer = 'https://api.weixin.qq.com';

  // 生成token
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  getUserByToken(token) {
    return this.jwtService.decode(token);
  }

  async loginWithWechat(code, userInfo) {
    if (!code) {
      throw new BadRequestException('请输入微信授权码');
    }
    await this.getSessionKey(code);
    console.log('loginWithWechat userInfo', userInfo);
    const user = await this.getUserByOpenid();
    if (!user) {
      // 获取用户信息，注册新用户
      const newUser = await this.userService.registerByWechat({
        ...userInfo,
        open_id: this.sessionKeyInfo.openid,
      });
      console.log('asa', newUser);
      return this.login(newUser);
    }
    return this.login(user);
  }

  async loginWithWeb(username, password) {
    const userInfo = await this.getUserByPwd(username, password);

    return this.loginWeb(userInfo);
  }

  async getUserByOpenid() {
    return await this.userService.findByOpenid(this.sessionKeyInfo.openid);
  }

  async getUserByPwd(username, password) {
    return await this.userService.findByPwd(username, password);
  }

  async login(user: Partial<User>) {
    const token = this.createToken({
      user_id: user.user_id,
      user_name: user.user_name,
    });
    await this.redisCacheService.cacheSet(
      `${user.user_id}&${user.user_name}`,
      token,
      1800,
    );
    return { token };
  }

  async loginWeb(user) {
    const token = this.createToken({
      user_id: user.user_id,
      user_name: user.user_id,
      role_key: user.role_key,
    });

    await this.redisCacheService.cacheSet(
      `${user.user_id}&${user.user_name}`,
      token,
      1800,
    );

    return { token: token, userInfo: user };
  }

  async getSessionKey(code) {
    const { APPID, APPSECRET } = process.env;
    if (!APPSECRET) {
      throw new BadRequestException('[getAccessToken]必须有appSecret');
    }
    if (
      !this.sessionKeyInfo ||
      (this.sessionKeyInfo && this.isExpires(this.sessionKeyInfo))
    ) {
      console.log('getAccessToken code', code);
      console.log('getAccessToken APPID', APPID);
      console.log('getAccessToken APPSECRET', APPSECRET);
      // 请求accessToken数据
      const res = await lastValueFrom(
        this.httpService.get(
          `${this.apiServer}/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`,
        ),
      );

      console.log('getAccessToken res', res.data);
      // if (res.data.errcode) {
      //   throw new BadRequestException(
      //     `[getAccessToken] errcode:${res.data.errcode}, errmsg:${res.data.errmsg}`,
      //   );
      // }
      this.sessionKeyInfo = {
        sessionKey: res.data.session_key,
        expiresIn: res.data.expires_in,
        getTime: Date.now(),
        openid: res.data.openid,
      };
    }

    return this.sessionKeyInfo.sessionKey;
  }

  async getUser(user) {
    return await this.userService.findOne(user.id);
  }

  async setRolePermission(roleId, menuIdList) {
    const role = await this.roleService.findByRoleId(roleId);
    const menuList = [];
    for await (const menuId of menuIdList) {
      const menu = await this.menuService.findById(menuId);
      console.log('menu', menu);
      menu ? menuList.push(menu) : '';
    }
    role.menus = menuList;
    console.log('role', role);
    console.log('menuList', menuList);
    return await this.roleService.update(roleId, role);
  }
  isExpires(access) {
    return Date.now() - access.getTime > access.expiresIn * 1000;
  }
}
