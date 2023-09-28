import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { LocalStorage } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { RedisCacheService } from 'src/db/redis-cache.service';
import { MenuModule } from 'src/menu/menu.module';
import { RoleModule } from 'src/role/role.module';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET', 'test123456'),
      signOptions: { expiresIn: '4h' },
    };
  },
});
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    PassportModule,
    UserModule,
    RoleModule,
    MenuModule,
    jwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage, JwtStrategy, RedisCacheService],
  exports: [jwtModule, AuthService],
})
export class AuthModule {}
