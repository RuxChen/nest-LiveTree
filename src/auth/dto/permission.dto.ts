import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RolePermissionDto {
  @ApiProperty({ description: '角色标识' })
  @IsNotEmpty({ message: '请输入角色标识' })
  roleKey: string;
}
