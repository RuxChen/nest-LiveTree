import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QueryRoleDto {
  @ApiProperty({ description: '页码' })
  @IsNotEmpty({ message: '请输入页码' })
  readonly pageNum: number;

  @ApiProperty({ description: '页数' })
  @IsNotEmpty({ message: '请输入页数' })
  readonly pageSize: number;
}

export class RolePermissionDto {
  @ApiProperty({ description: '角色id' })
  @IsNotEmpty({ message: '请输入角色id' })
  readonly role_id: number;
}

export class SetRolePermissionDto {
  @ApiProperty({ description: '角色id' })
  @IsNotEmpty({ message: '请输入角色id' })
  readonly id: number;

  @ApiProperty({ description: '角色id' })
  @IsNotEmpty({ message: '请输入角色id' })
  readonly menu_id_list: any[];
}
