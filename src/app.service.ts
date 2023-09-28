import { Injectable } from '@nestjs/common';
import { CosService, UploadFileRo } from './core/shared-service/cos.service';

@Injectable()
export class AppService {
  constructor(private readonly cosService: CosService) {}
  async upload(file): Promise<UploadFileRo> {
    // 判断文件是否存在
    console.log('existFile', file.filename, file.path);

    const existFile = await this.cosService.getFile(file.filename, file.path);
    if (existFile.url) {
      return existFile;
    }
    return await this.cosService.uploadFile(file.filename, file.path);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
