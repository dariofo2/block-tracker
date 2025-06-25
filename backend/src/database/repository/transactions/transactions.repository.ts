import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "src/controllers/transactions/entities/transaction.entity";
import { DataSource, Equal, Repository } from "typeorm";

@Injectable()
export class TransactionsRepository {
    constructor (
        private dataSource: DataSource,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>
    ) {}
    
    async create (transactions: Transaction|Transaction[]) : Promise<Transaction|Transaction[]> {
        if (transactions instanceof Transaction) {
            return await this.transactionRepository.save(transactions);
        } else {
            return await this.transactionRepository.save(transactions);
        }
    }

    async list () : Promise<Transaction[]> {
        const listTransactionsResponse= await this.transactionRepository.find();
        return listTransactionsResponse;
    }

    async get (id:number) : Promise<Transaction|null>{
        const transactionResponse= await this.transactionRepository.findOne({
            where: {
                id: Equal(id)
            }
        })
        return transactionResponse;
    }
}