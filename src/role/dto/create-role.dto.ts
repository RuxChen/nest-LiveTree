import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Menu } from 'src/menu/entities/menu.entity';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty({ message: '角色名称必填' })
  readonly roleName: string;

  @IsNotEmpty({ message: '角色标识必填' })
  @ApiPropertyOptional({ description: '角色标识' })
  readonly roleKey: string;

  @ApiPropertyOptional({ description: '角色序号' })
  readonly roleSort: string;

  // @ApiPropertyOptional({ description: '路由激活' })
  // readonly activeMenu: string;
  // @ApiPropertyOptional({ description: '菜单' })
  // readonly menus: Menu[];
}
