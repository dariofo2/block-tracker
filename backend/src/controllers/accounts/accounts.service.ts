import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DataSource } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsRepository } from 'src/database/repository/accounts/accounts.repository';
import { Transaction } from '../transactions/entities/transaction.entity';
import { TransactionsRepository } from 'src/database/repository/transactions/transactions.repository';
import { plainToClass } from 'class-transformer';
import { TransactionsService } from '../transactions/transactions.service';
import DeleteAccountDTO from './dto/delete-account.dto';

@Injectable()
export class AccountsService {
  constructor (
        private accountsRepository: AccountsRepository,
        private transactionsService: TransactionsService,
        private transactionsRepository: TransactionsRepository
  ) {}
  async create(createAccountDto: CreateAccountDto) {
    const newAccount=plainToClass(Account,createAccountDto);
    const accountCreated=await this.accountsRepository.create(newAccount);

    //await this.transactionsService.getTransactionsOfAccount(accountCreated.address);
    return accountCreated; 
  }

  async list() {
    return await this.accountsRepository.list();
  }

  async get(id: number) {
    return await this.accountsRepository.get(id);
  }

  /*
  async update(id: number, updateAccountDto: UpdateAccountDto) {
    return `Update is Disabled in This Endpoint`;
  }
    */

  async remove(deleteAccountDTO: DeleteAccountDTO) {
    return await this.accountsRepository.delete(deleteAccountDTO.id) ;
  }
}
