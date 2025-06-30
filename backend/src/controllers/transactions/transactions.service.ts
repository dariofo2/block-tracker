import { BadRequestException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
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
import { ListAccountsLastBlockDTO } from '../accounts/dto/list-account-lastBlock.dto';
import BullMQClientService from 'src/bullMQ/bullMQ.client.service';
import listRequestGraphsDTO from 'src/database/dto/listRequestGraphs.dto';
import { RequestListGroupByAccountAndTimeStamp } from './dto/list/requestListGroupByAccountAndTimeStamp.dto';
import { WebSocketsGateway } from 'src/web-sockets/web-sockets.gateway';
import { ListRequestDatatablesDTO } from 'src/database/dto/listRequestDatatables.dto';
import { ListResponseDatatablesDTO } from 'src/database/dto/listResponseDatatables.dto';

@Injectable()
export class TransactionsService implements OnApplicationBootstrap {
  private timeToNextRefresh: number = parseInt(process.env.TIME_BEETWEN_TIMEOUT as string);
  
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository,
    private web3Service: Web3Service,
    private axiosService: AxiosService,
    private bullMQClientService: BullMQClientService,
    private webSocketsGateWay: WebSocketsGateway
  ) { }

  async create(transactions: CreateTransactionDto | CreateTransactionDto[]) {
    return await this.transactionsRepository.create(transactions);
  }

  async list(listRequestDatatablesDTO: ListRequestDatatablesDTO): Promise<ListResponseDatatablesDTO<Transaction>> {
    //console.log(await this.accountsRepository.listWithLastTransactionBlock());
    return await this.transactionsRepository.list(listRequestDatatablesDTO);
  }

  async listByAccountId(listRequestDatatablesDTO: ListRequestDatatablesDTO): Promise<ListResponseDatatablesDTO<Transaction>> {
    //console.log(await this.accountsRepository.listWithLastTransactionBlock());
    return await this.transactionsRepository.listByAccountId(listRequestDatatablesDTO);
  }

  async get(id: number) {
    return await this.transactionsRepository.get(id);
  }

  async listGroupByAccountsAndTime (listRequestGraphsDTO: listRequestGraphsDTO<RequestListGroupByAccountAndTimeStamp>) {
    switch (listRequestGraphsDTO.data.type) {
      case "days":
        return await this.transactionsRepository.listGroupByAccountAndDay(listRequestGraphsDTO.data.secondsFrom);
      break;
      case "months":
        return await this.transactionsRepository.listGroupByAccountAndMonth(listRequestGraphsDTO.data.secondsFrom);
      break;
      case "seconds":
        return await this.transactionsRepository.listGroupByAccountAndTimeStamp(listRequestGraphsDTO.data.secondsFrom);
      break;
    }
    
  }

  onApplicationBootstrap() {
    this.initializeAppRefreshTimeOut();
  }

  /**
   * Initialize App Refresh Timeout
   */
  async initializeAppRefreshTimeOut() {
    setTimeout(() => {
      this.getAccountsAndAddTransactionsJobsToQueue();
    }, this.timeToNextRefresh);
    
  }

  /**
   * Get Accounts with LastTransactionBlock
   * Add Accounts Divided by process.env.ETHERSCAN_MAX_CALLS_PER_SECOND
   * Call Await until Finished
   */

  async getAccountsAndAddTransactionsJobsToQueue() {
    const accounts = await this.accountsRepository.listWithLastTransactionBlock();
    const maxCallsPerSecond= parseInt(process.env.ETHERSCAN_MAX_CALLS_PER_SECOND as string);

    if (accounts.length>0) {
      //Divide Accounts by MaxCallsPerSeconds and send To Queue
      for (let i = 0; i < accounts.length; i+=maxCallsPerSecond) {
        const accountsByCall=(accounts.slice(i,i+maxCallsPerSecond));
        await this.bullMQClientService.addTransactionsRefreshJob(accountsByCall);  
      }
    }

    await this.awaitUntilAllJobsFinished()
  }

  /**
   * Awaits until all jobs finished and start timeout again
   */
  async awaitUntilAllJobsFinished () {
    await this.bullMQClientService.waitUntilFinishedJobs();
    await this.transactionsRepository.deleteCache();

    await this.initializeAppRefreshTimeOut();
    await this.webSocketsGateWay.refreshMessage();
    console.log("finished");
  }


  /**
   * Refresh new Transactions of All accounts from last Block Used By Account to -> Last Block in Blockchain -1
   * If Account has 0 Transactions in DB, it gets last Block in Blockchain - process.env.past_Blocks
   */
  async refreshNewTransactionsOfAccounts(accounts:ListAccountsLastBlockDTO[]) {
    //Get Ethereum Blockchain Last Block
    const lastBlockchainBlock = parseInt((await this.web3Service.node.eth.getBlockNumber()).toString());

    //Create Promise Array to later use Promise.all()
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

        // Makes The Request to Etherscan
        const GetEtherscanTransactionsDTO: GetEtherscanTransactionsDTO = {
          address: account.address,
          startblock: startBlock,
          endblock: lastBlockchainBlock - 1,
          page: 1,
          offset: 10000,
          sort: "desc",
          action: "txlist",
          module: "account",
          chainid: 1
        };

        //Create Promise and add To Promise Array to later do Promise.all
        const transactionsResponsePromise = this.axiosService.getTransactionsOfAccount(GetEtherscanTransactionsDTO);
        axiosPromises.push(transactionsResponsePromise);
      }

      const responses = await Promise.all(axiosPromises);

      // Create Transactions From etherscan Response Transactions to DB Block

      const createTransactions: CreateTransactionDto[] = [];

      //For each Account Etherscan AxiosResponse
      for (let i = 0; i < responses.length; i++) {
        const accountNewTxs = responses[i] as TransactionEtherscanDTO[];

        //For Each Transaction
        for (let z = 0; z < accountNewTxs.length; z++) {
          const tx = accountNewTxs[z];

          //console.log(responses)
          //input field is from Sending to a Contract, if not 0x is an ERC-20
          if (tx.input.length >= 6) {
            //Try, if is not ERC20 Method upload Transaction equal as others
            try {
              //Decode Method and Parameters of tx.input (data)
              //const methodDecoded=await this.web3Service.decodeMethodDataERC20(tx.input);
              const methodDecoded = this.web3Service.erc20Contract.decodeMethodData(tx.input);
              // Get ERC20 Data //Get the Name  Symbol and Decimals of the ERC-20
              const ERC20Data = await this.web3Service.getDataOfERC20Token(tx.to);

              //console.log(methodDecoded);

              //Convert value to Real depending on decimals
              const realValue = (parseInt(methodDecoded[1] as string) / Math.pow(10, parseInt(ERC20Data.decimals))).toFixed(2);

              //console.log(realValue);

              createTransactions.push({
                account: {
                  id: accounts[i].id
                },
                fromAcc: tx.from,
                toAcc: methodDecoded[0] as string,
                value: realValue,
                block: tx.blockNumber,
                hash: tx.blockHash,
                isErc20: true,
                contractAddress: tx.to,
                name: ERC20Data.name,
                symbol: ERC20Data.symbol,
                decimals: ERC20Data.decimals,
                method: methodDecoded.__method__,
                date: parseInt(tx.timeStamp)
              })
              //Unknown Method Transaction (Not ERC-20 and Not Ethereum)
            } catch (error) {
              createTransactions.push({
                account: {
                  id: accounts[i].id
                },
                fromAcc: tx.from,
                toAcc: tx.to,
                value: this.web3Service.node.utils.fromWei(tx.value, "ether"),
                block: tx.blockNumber,
                hash: tx.blockHash,
                isErc20: false,
                method: "unknown",
                contractAddress: tx.contractAddress,
                date: parseInt(tx.timeStamp)
              })
            }

            //Normal Transaction
          } else {
            createTransactions.push({
              account: {
                id: accounts[i].id
              },
              fromAcc: tx.from,
              toAcc: tx.to,
              value: this.web3Service.node.utils.fromWei(tx.value, "ether"),
              block: tx.blockNumber,
              hash: tx.blockHash,
              name: "Ethereum",
              symbol: "Eth",
              decimals: "18",
              isErc20: false,
              contractAddress: tx.contractAddress,
              date: parseInt(tx.timeStamp)
            })
          }

        }
      }
      this.web3Service.getPriceUSDOfERC20Token("0xd0ec028a3d21533fdd200838f39c85b03679285d");
      console.log(createTransactions);

      // Save Transactions to DB
      await this.create(createTransactions);
    }
  }
}
