import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  QueryRoleDto,
  RolePermissionDto,
  SetRolePermissionDto,
} from './dto/role.dto';
import { CreateMenuDto } from 'src/menu/dto/create-menu.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Post('/getRoleList')
  findAll(@Body() query: QueryRoleDto) {
    return this.roleService.findAll(query);
  }

  @Post('/getRolePermission')
  findAllRolePermission(@Body() role_id: RolePermissionDto) {
    return this.roleService.getRolePermission(role_id);
  }

  @Post('/setRolePermission')
  setRolePermission(@Body() role_permission: SetRolePermissionDto) {
    return this.roleService.setRolePermission(role_permission);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('roleKey') roleKey: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(roleKey, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
