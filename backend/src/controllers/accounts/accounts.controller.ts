import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post("create")
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Post("list")
  list() {
    return this.accountsService.list();
  }

  @Post("get")
  get(@Body() id: string) {
    return this.accountsService.get(+id);
  }

  @Post('update')
  update(@Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(1,updateAccountDto);
  }

  @Post('delete')
  remove(@Body() deleteAccountDTO) {
    return this.accountsService.remove(deleteAccountDTO);
  }
}
