import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass, plainToInstance } from "class-transformer";
import { CreateAccountDto } from "src/controllers/accounts/dto/create-account.dto";
import {ListAccountsLastBlockDTO } from "src/controllers/accounts/dto/list-account-lastBlock.dto";
import { Account } from "src/controllers/accounts/entities/account.entity";
import { DataSource, Equal, Repository } from "typeorm";

@Injectable()
export class AccountsRepository {
    constructor (
        private dataSource: DataSource,
        @InjectRepository(Account) 
        private accountsRepository: Repository<Account>
    ) {}

    async create (newAccount: Account) : Promise<Account> {
        try {
        return await this.accountsRepository.save(newAccount);
        } catch (error) {
            console.error(error);
            throw new BadRequestException("Error on Adding to Database");
        }
    }

    /* We Dont use update, only create or Delete
    async update () {

    }
    */

    async delete (id: number) {
        try {
            await this.accountsRepository.delete({
                id:Equal(id)
            });
        } catch (error) {
            console.error(error);
            throw new BadRequestException("Error on Deleting From Database");
        }
    }

    async list () : Promise<Account[]> {
        const listAccountsResponse=await this.accountsRepository.find();
        return listAccountsResponse;
    }

    async get (id:number) : Promise<Account|null> {
        const accountResponse=await this.accountsRepository.findOne({
            where: {
                id: id
            }
        })
        return accountResponse;
    }


    //Selects
    async listWithLastTransactionBlock () : Promise<ListAccountsLastBlockDTO[]> {
        const response = await this.dataSource
        .createQueryBuilder()
        .select("accounts.id, accounts.address, (SELECT block FROM transactions t WHERE t.accountId=accounts.id ORDER BY block DESC LIMIT 1) as lastBlockNumber")
        .from(Account,"accounts")
        .getRawMany();

        const listAccountsLastBlockDTO=plainToInstance(ListAccountsLastBlockDTO,response);
        return listAccountsLastBlockDTO;
    }

    /**
     * List Transactions by Account and By TimeStamp Seconds (Each timeStamp is 15 Secs Duration)
     * From Time what u want
     */
    async listAccountTransactionsByAccountIdAndTimeStamp() {
        /*
            SELECT acc.id,acc.address, tr.date, tr.block, count(*), sum(cast(tr.value AS DECIMAL(5,4)))
            FROM blocktracker.transactions tr
            LEFT JOIN blocktracker.accounts acc ON tr.accountId=acc.id
            WHERE tr.date>(unix_timestamp(now())-259200)
            GROUP BY acc.id,tr.block
            ORDER BY tr.date DESC
            ;

        */
    }

    /**
     * List Transactions By Account and By Day
     * from time what u want
     */
    async listAccountTransactionsByDay () {
        /*
            SELECT acc.id,acc.address, date(from_unixtime(tr.date)), tr.block, count(*)
            FROM blocktracker.transactions tr
            LEFT JOIN blocktracker.accounts acc ON tr.accountId=acc.id
            WHERE tr.date>(unix_timestamp(now())-259200)
            GROUP BY acc.id,date(from_unixtime(tr.date))
            ORDER BY tr.date DESC
            ;
        */
    }

    async listAccountTransactionsByMonth () {
        /*
            SELECT acc.id,acc.address, concat(year(from_unixtime(tr.date)),"-",month(from_unixtime(tr.date))) , tr.block, count(*)
            FROM blocktracker.transactions tr
            LEFT JOIN blocktracker.accounts acc ON tr.accountId=acc.id
            WHERE tr.date>(unix_timestamp(now())-25920000)
            GROUP BY acc.id,concat(year(from_unixtime(tr.date)),"-",month(from_unixtime(tr.date)))
            ORDER BY tr.date DESC
            ;
        */
    }
}