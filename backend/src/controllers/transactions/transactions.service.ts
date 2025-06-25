import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DataSource } from 'typeorm';
import { AccountsRepository } from 'src/database/repository/accounts/accounts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionsRepository } from 'src/database/repository/transactions/transactions.repository';
import { Web3Service } from 'src/web3/web3.service';
import GetEtherscanTransactionsDTO from 'src/axios/dto/get-etherscan-transactions.dto';
import AxiosService from 'src/axios/axios.service';

@Injectable()
export class TransactionsService {
  private lastBlockUsed: number = 0

  constructor (
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository,
    private web3Service: Web3Service,
    private axiosService: AxiosService
  ) {}

  async create(transactions: Transaction|Transaction[]) {
    return await this.transactionsRepository.create(transactions);
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
  async getTransactionsOfAccount (address: string) {
    const blocksToPast=parseInt(process.env.PAST_TRANSACTIONS_BLOCKS as string);
    if (this.lastBlockUsed<=0) {
      const lastBlock=parseInt((await this.web3Service.node.eth.getBlockNumber()).toString());
      this.lastBlockUsed=lastBlock-1;
    } else {
      
    }

    const GetEtherscanTransactionsDTO: GetEtherscanTransactionsDTO = {
      address: address,
      startblock: this.lastBlockUsed-blocksToPast,
      endblock: this.lastBlockUsed,
      page: 1,
      offset: 10000,
      sort: "asc",
      action: "txlist",
      module: "account"
    };

    const transactionsResponse=await this.axiosService.getTransactionsOfAccount(GetEtherscanTransactionsDTO);
    console.log(transactionsResponse);
  }

  /**
   * Refresh new Transactions of All accounts from last Block Used and Update LastBlockUsed
   */
  async refreshNewTransactionsOfAccounts () {
    const accounts=await this.accountsRepository.list();
    const lastBlock=parseInt((await this.web3Service.node.eth.getBlockNumber()).toString());
    this.lastBlockUsed=lastBlock-1;

    if (accounts.length>0) {
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const GetEtherscanTransactionsDTO: GetEtherscanTransactionsDTO = {
          address: account.address,
          startblock: this.lastBlockUsed+1,
          endblock: lastBlock-1,
          page: 1,
          offset: 10000,
          sort: "asc",
          action: "txlist",
          module: "account"
        };

        const transactionsResponse=await this.axiosService.getTransactionsOfAccount(GetEtherscanTransactionsDTO);
        console.log(transactionsResponse);
        //if (transactionsResponse) this.create(transactionsResponse)
      }
    }
  }
}
