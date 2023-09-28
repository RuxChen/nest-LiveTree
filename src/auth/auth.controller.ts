import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PcLoginDto, WechatLoginDto } from './dto/wechat-login.dto';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  // @UseGuards(AuthGuard('local'))
  // @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: PcLoginDto, required: true })
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.loginWithWeb(username, password);
  }

  @ApiOperation({ summary: '微信登录' })
  @ApiBody({ type: WechatLoginDto, required: true })
  @Post('wechat')
  async loginWithWechat(
    @Body('code') code: string,
    @Body('userInfo') userInfo: object,
  ) {
    return this.authService.loginWithWechat(code, userInfo);
  }
}
