import { HttpException, Injectable } from '@nestjs/common';

const { env } = process;
const fs = require('fs');
const path = require('path');

export interface UploadFileRo {
  url: string;
  // filename: string;
}

const COS = require('cos-nodejs-sdk-v5');
const cos = new COS({
  SecretId: 'AKIDZ5UluulS0Pekhv32ueIrNn4B9yeAWjni',
  SecretKey: 'rYP9mFampmZDj5HJCwa7Xq1Wu9GF6vdH',
});

@Injectable()
export class CosService {
  public cosPath = '/Users/x/programs/nest-demo/image/';
  public urlPrefix = 'post-1304142546.cos.ap-guangzhou.myqcloud.com/';
  async uploadFile(cosName: string, localPath: string): Promise<UploadFileRo> {
    console.log('uploadFile Bucket: ', env.Bucket);
    console.log('uploadFile Region: ', env.Region);
    console.log('uploadFile localPath', localPath);
    const filepath = '/Users/x/programs/nest-demo/image/';
    console.log('uploadFile filepath', filepath);
    console.log('uploadFile Key cosPath', this.cosPath);
    console.log('uploadFile Key cosName', cosName);
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: env.Bucket,
        Region: env.Region,
        Key: cosName, // cos 图片地址
        FilePath: filepath + cosName /* 必须 ，本地地址*/,
        SliceSize: 1024 * 1024 * 2 /* 超过2MB使用分块上传，非必须 */,
      };
      cos.uploadFile(
        {
          ...params,
          onFileFinish: (err, data, options) => {
            console.log(options.Key + '上传' + (err ? '失败' : '完成'));
          },
        },
        (err, data) => {
          console.log('uploadFile err', err, data);
          // 删除本地文件
          // fs.unlinkSync(localPath);
          if (err) throw new HttpException(err, 401);
          resolve({
            url: 'https://' + data.Location,
            filename: cosName,
          } as UploadFileRo);
        },
      );
      cos.headBucket(
        {
          Bucket: env.Bucket,
          Region: env.Region,
        },
        function (err, data) {
          if (err) {
            console.log('headBucket', err.error);
          }
        },
      );
    });
  }
  async getFile(filename: string, localPath: string): Promise<UploadFileRo> {
    return new Promise((resolve, reject) => {
      console.log('getFile Bucket: ', env.Bucket);
      console.log('getFile Region: ', env.Region);
      console.log('getFile Prefix: ', this.cosPath + filename);
      cos.getBucket(
        {
          Bucket: env.Bucket,
          Region: env.Region,
          Prefix: filename,
        },
        (err, data) => {
          if (err) {
            reject(err);
            throw new HttpException(err, 401);
          }
          // 文件已存在
          if (data.Contents && data.Contents.length > 0) {
            // 删除本地文件
            fs.unlinkSync(localPath);
            resolve({ url: this.urlPrefix + this.cosPath + filename });
          } else {
            resolve({ url: '' });
          }
        },
      );
    });
  }
}
