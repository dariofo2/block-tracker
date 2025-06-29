import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListRequestDatatablesDTO } from 'src/database/dto/listRequestDatatables.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("list")
  list(@Body() listRequestDatatablesDTO: ListRequestDatatablesDTO) {
    return this.usersService.list(listRequestDatatablesDTO);
  }

  @Post('get')
  get(@Body() getDTO:{id: number}) {
    return this.usersService.get(getDTO.id);
  }

  @Post('update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Post('delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
