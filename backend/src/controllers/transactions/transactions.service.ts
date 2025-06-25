import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DataSource } from 'typeorm';
import { AccountsRepository } from 'src/database/repository/accounts/accounts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { Transaction as tx } from "web3"
import { TransactionsRepository } from 'src/database/repository/transactions/transactions.repository';
import { Web3Service } from 'src/web3/web3.service';
import GetEtherscanTransactionsDTO from 'src/axios/dto/get-etherscan-transactions.dto';
import AxiosService from 'src/axios/axios.service';
import TransactionEtherscanDTO from 'src/axios/dto/transaction-etherscan.dto';

@Injectable()
export class TransactionsService implements OnApplicationBootstrap {
  private lastBlockUsed: number = 0

  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository,
    private web3Service: Web3Service,
    private axiosService: AxiosService
  ) { }

  async create(transactions: CreateTransactionDto | CreateTransactionDto[]) {
    return await this.transactionsRepository.create(transactions);
  }
  async list(): Promise<Transaction[]> {
    console.log(await this.accountsRepository.listWithLastTransactionBlock());
    return await this.transactionsRepository.list();
  }

  async get(id: number) {
    return await this.transactionsRepository.get(id);
  }

  onApplicationBootstrap() {
    this.initializeAppRefreshLoop();  
  }

  /**
   * Initialize App Refresh Loop
   */
  async initializeAppRefreshLoop() {
    setInterval(() => {
      this.refreshNewTransactionsOfAccounts();
    }, 15000);
  }

  /**
   * Get Transactions of Account until Last Block Used
   * If no blocks used, it starts to Last Block - 1
   */
  async getTransactionsOfAccount(address: string) {
    const blocksToPast = parseInt(process.env.PAST_TRANSACTIONS_BLOCKS as string);
    if (this.lastBlockUsed <= 0) {
      const lastBlock = parseInt((await this.web3Service.node.eth.getBlockNumber()).toString());
      this.lastBlockUsed = lastBlock - 1;
    } else {

    }

    const GetEtherscanTransactionsDTO: GetEtherscanTransactionsDTO = {
      address: address,
      startblock: this.lastBlockUsed - blocksToPast,
      endblock: this.lastBlockUsed,
      page: 1,
      offset: 10000,
      sort: "asc",
      action: "txlist",
      module: "account"
    };

    const transactionsResponse = await this.axiosService.getTransactionsOfAccount(GetEtherscanTransactionsDTO);
    console.log(transactionsResponse);
  }

  /**
   * Refresh new Transactions of All accounts from last Block Used By Account to -> Last Block in Blockchain -1
   * If Account has 0 Transactions in DB, it gets last Block in Blockchain - process.env.past_Blocks
   */
  async refreshNewTransactionsOfAccounts() {
    const accounts = await this.accountsRepository.listWithLastTransactionBlock();

    const lastBlockchainBlock = parseInt((await this.web3Service.node.eth.getBlockNumber()).toString());

    let axiosPromises: Promise<TransactionEtherscanDTO[] | null>[] = [];

    if (accounts.length > 0) {
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];

        //Get the Start Block
        let startBlock = 0;
        if (!account.lastBlockNumber) {
          const blocksToPast = parseInt(process.env.PAST_TRANSACTIONS_BLOCKS as string);
          startBlock = lastBlockchainBlock - blocksToPast;
        } else {
          startBlock = parseInt(account.lastBlockNumber) + 1;
        }

        // Makes The Request
        const GetEtherscanTransactionsDTO: GetEtherscanTransactionsDTO = {
          address: account.address,
          startblock: startBlock,
          endblock: lastBlockchainBlock - 1,
          page: 1,
          offset: 10000,
          sort: "desc",
          action: "txlist",
          module: "account"
        };

        console.log(GetEtherscanTransactionsDTO);
        const transactionsResponsePromise = this.axiosService.getTransactionsOfAccount(GetEtherscanTransactionsDTO);
        axiosPromises.push(transactionsResponsePromise);

        //if (transactionsResponse) this.create(transactionsResponse)
      }


      const responses=await Promise.all(axiosPromises); 
      
      // Create Transactions
      const createTransactions:CreateTransactionDto[]=[];
      for (let i = 0; i < responses.length; i++) {
        const accountNewTxs = responses[i] as TransactionEtherscanDTO[];
        
        for (let z = 0; z < accountNewTxs.length; z++) {
          const tx = accountNewTxs[z];
          const from=tx.from as string;
          createTransactions.push({
            account: {
              id:accounts[i].id
            },
            fromAcc:tx.from,
            toAcc: tx.to,
            value: tx.value,
            block: tx.blockNumber,
            hash: tx.blockHash,
            isErc20:false,
            contractAddress:tx.contractAddress,
            date:parseInt(tx.timeStamp)
          })
        }
      }

      console.log(createTransactions);
      this.create(createTransactions);
    }
  }
}
