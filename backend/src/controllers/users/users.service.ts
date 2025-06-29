import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListRequestDatatablesDTO } from 'src/database/dto/listRequestDatatables.dto';
import UsersRepository from 'src/database/repository/users/users.repository';

@Injectable()
export class UsersService {
  constructor (
    private usersRepository: UsersRepository
  ) {}
  list(listRequestDatatablesDTO:ListRequestDatatablesDTO) {
    return this.usersRepository.list(listRequestDatatablesDTO);
  }

  get(id: number) {
    return this.usersRepository.get(id)
  }

  update(updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
