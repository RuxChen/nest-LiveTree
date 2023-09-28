import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import envConfig from '../config/env';
import { PostsEntity } from './posts/posts.entity';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { RedisCacheModule } from './db/redis-cache.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CosModule } from './core/shared-service/cos.module';
import { PostImagesModule } from './post_images/post_images.module';
import { MenuModule } from './menu/menu.module';
import { Menu } from './menu/entities/menu.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', '12345678'), // 密码
        database: configService.get('DB_DATABASE', 'nest-demo-db'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        entities: [PostsEntity, User, Role, Menu], // 数据表实体
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        autoLoadEntities: true,
      }),
    }),
    RoleModule,
    PostsModule,
    UserModule,
    AuthModule,
    RedisCacheModule,
    CosModule,
    ScheduleModule.forRoot(),
    PostImagesModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
