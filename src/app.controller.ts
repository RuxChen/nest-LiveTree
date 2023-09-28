import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const { env } = process;

const COS = require('cos-nodejs-sdk-v5');
const image = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'webp'];
const video = ['mp4', 'webm'];
const audio = ['mp3', 'wav', 'ogg'];

const config = {
  fileTempPath: '',
};
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        // 配置上传后文件存储位置
        destination: (req, file, cb) => {
          // 根据上传的文件类型将图片视频音频和其他类型文件分别存到对应英文文件夹
          const mimeType = file.mimetype.split('/')[1];
          let temp = 'other';
          image.filter((item) => item === mimeType).length > 0
            ? (temp = 'image')
            : '';
          video.filter((item) => item === mimeType).length > 0
            ? (temp = 'video')
            : '';
          audio.filter((item) => item === mimeType).length > 0
            ? (temp = 'audio')
            : '';

          const filePath = `${config.fileTempPath}${temp}`;
          // 判断文件夹是否存在，不存在则自动生成
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
          }
          return cb(null, `${filePath}`);
        },
        // 配置文件名称
        filename: async (req, file, cb) => {
          const index = file.originalname.lastIndexOf('.');

          const md5File = await getMd5File(file);
          //获取后缀
          const ext = file.originalname.substr(index);
          cb(null, md5File + ext);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile('file') file: Express.Multer.File) {
    console.log('uploadFile file123', file);
    return await this.appService.upload(file);
  }
}
function getMd5File(file) {
  const buffer = Buffer.from(JSON.stringify(file), 'utf-8');
  const md5File = crypto
    .createHash('md5')
    .update(JSON.stringify(buffer))
    .digest('hex');
  return md5File;
}
