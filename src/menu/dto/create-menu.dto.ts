import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty({ message: '父级菜单id必填' })
  @ApiPropertyOptional({ description: '父级菜单id' })
  readonly pid: number;

  @ApiProperty({ description: '菜单标题' })
  @IsNotEmpty({ message: '菜单标题必填' })
  readonly title: string;

  @IsNotEmpty({ message: '菜单名称必填' })
  @ApiPropertyOptional({ description: '菜单名称' })
  readonly name: string;

  @IsNotEmpty({ message: '路由组件路径必填' })
  @ApiPropertyOptional({ description: '路由组件路径' })
  readonly component: string;

  @ApiPropertyOptional({ description: '路由激活' })
  readonly activeMenu: string;
}
