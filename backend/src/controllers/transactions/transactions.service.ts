import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DataSource } from 'typeorm';
import { AccountsRepository } from 'src/database/repository/accounts/accounts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionsRepository } from 'src/database/repository/transactions/transactions.repository';

@Injectable()
export class TransactionsService {
  private lastBlockUsed: string

  constructor (
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async create(transactions: Transaction|Transaction[]) {

  }
  async list() :Promise<Transaction[]> {
    return await this.transactionsRepository.list();
  }

  async get(id: number) {
    return await this.transactionsRepository.get(id);
  }

  /**
   * Get Transactions of Account until Last Block Used
   * If no blocks used, it starts to Last Block - 1
   */
  async getTransactionsOfAccount () {
    if (this.lastBlockUsed!="") {
      
    } else {

    }
  }

  /**
   * Refresh new Transactions of All accounts from last Block Used and Update LastBlockUsed
   */
  async refreshNewTransactionsOfAccounts () {

  }
}
