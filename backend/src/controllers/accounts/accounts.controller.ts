import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import DeleteAccountDTO from './dto/delete-account.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post("create")
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Post("list")
  async list() {
    return this.accountsService.list();
  }

  @Post("get")
  async get(@Body() id: string) {
    return this.accountsService.get(+id);
  }

  /* Update Disabled
  @Post('update')
  async update(@Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(1,updateAccountDto);
  }
    */

  @Post('delete')
  async remove(@Body() deleteAccountDTO: DeleteAccountDTO) {
    return this.accountsService.remove(deleteAccountDTO);
  }
}
