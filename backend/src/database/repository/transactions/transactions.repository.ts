import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Account } from "src/controllers/accounts/entities/account.entity";
import { CreateTransactionDto } from "src/controllers/transactions/dto/create-transaction.dto";
import { ResponseListGroupByAccountAndTimeStamp } from "src/controllers/transactions/dto/list/responseListGroupByAccountAndTimeStamp.dto";
import { Transaction } from "src/controllers/transactions/entities/transaction.entity";
import { ListRequestDatatablesDTO } from "src/database/dto/listRequestDatatables.dto";
import { ListResponseDatatablesDTO } from "src/database/dto/listResponseDatatables.dto";
import listReponseGraphsDTO from "src/database/dto/listResponseGraphs.dto";
import { DataSource, Equal, Repository } from "typeorm";

@Injectable()
export class TransactionsRepository {
    mapCache = new Map<string, Set<string>>;

    constructor(
        private dataSource: DataSource,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>
    ) { }

    async create(transactions: CreateTransactionDto | CreateTransactionDto[]): Promise<Transaction | Transaction[]> {
        if (transactions instanceof CreateTransactionDto) {
            return await this.transactionRepository.save(transactions);
        } else {
            return await this.transactionRepository.save(transactions);
        }
    }

    async list(listRequestDatatablesDTO: ListRequestDatatablesDTO): Promise<ListResponseDatatablesDTO<Transaction>> {
        const listTransactions = await this.dataSource.createQueryBuilder()
            .select("transactions")
            .from(Transaction,"transactions")
            .leftJoinAndSelect("transactions.account","accounts")
            .where("(accounts.address like :search OR fromAcc like :search OR toAcc like :search OR value like :search OR block like :search OR hash like :search OR isErc20 like :search OR contractAddress like :search OR method like :search OR name like :search OR symbol like :search OR decimals like :search OR date like :search)", { search: listRequestDatatablesDTO.searchValue })
            .orderBy(listRequestDatatablesDTO.orderName, listRequestDatatablesDTO.orderDirection as "ASC" | "DESC")
            .limit(listRequestDatatablesDTO.limit)
            .offset(listRequestDatatablesDTO.offset)
            .getManyAndCount()

        const responseListDTO: ListResponseDatatablesDTO<Transaction> = {
            draw: listRequestDatatablesDTO.draw,
            data: listTransactions[0],
            recordsFiltered: listTransactions[1],
            recordsTotal: await this.transactionRepository.count()
        }

        //const listAccountsResponse=await this.accountsRepository.find();
        return responseListDTO;
    }

    async listByAccountId(listRequestDatatablesDTO: ListRequestDatatablesDTO): Promise<ListResponseDatatablesDTO<Transaction>> {
        const listTransactions = await this.dataSource.createQueryBuilder()
            .select("transactions")
            .from(Transaction,"transactions")
            .leftJoinAndSelect("transactions.account","accounts")
            .where("accounts.id=:accId AND (accounts.address like :search OR fromAcc like :search OR toAcc like :search OR value like :search OR block like :search OR hash like :search OR isErc20 like :search OR contractAddress like :search OR method like :search OR name like :search OR symbol like :search OR decimals like :search OR date like :search)", { search: listRequestDatatablesDTO.searchValue, accId: (listRequestDatatablesDTO.data as any).id })
            .orderBy(listRequestDatatablesDTO.orderName, listRequestDatatablesDTO.orderDirection as "ASC" | "DESC")
            .limit(listRequestDatatablesDTO.limit)
            .offset(listRequestDatatablesDTO.offset)
            .getManyAndCount()

            console.log(listTransactions);
        const responseListDTO: ListResponseDatatablesDTO<Transaction> = {
            draw: listRequestDatatablesDTO.draw,
            data: listTransactions[0],
            recordsFiltered: listTransactions[1],
            recordsTotal: await this.transactionRepository.count()
        }

        //const listAccountsResponse=await this.accountsRepository.find();
        return responseListDTO;
    }

    async get(id: number): Promise<Transaction | null> {
        const transactionResponse = await this.transactionRepository.findOne({
            where: {
                id: Equal(id)
            }
        })
        return transactionResponse;
    }


    /**
     * S E L E C T S
     */
    /**
     * List Transactions by Account and By TimeStamp Seconds (Each timeStamp is 15 Secs Duration)
     * From Time what u want until now
     */
    async listGroupByAccountAndTimeStamp(secondsFrom: number) {
        const queryName = "groupByAccountAndTimeStamp";
        const queryValue = `:${secondsFrom}`;

        const transactions = await this.dataSource.createQueryBuilder()
            .select("acc.id as id, acc.address as address, tr.date as date, tr.block as block, count(*) as totalcount, sum(cast(tr.value AS DECIMAL(20,8))) as totalvalue")
            .from(Transaction, "tr")
            .leftJoin(Account, "acc", "acc.id=tr.accountId")
            .where("tr.date>(unix_timestamp(now()) - :secondsFrom)", { secondsFrom: secondsFrom })
            .groupBy("acc.id,tr.date")
            .cache(queryName + queryValue, 100000)
            .getRawMany();

        this.addCache(queryName, queryValue);

        const responseListGroup = plainToInstance(ResponseListGroupByAccountAndTimeStamp, transactions);
        const responseGraphDTO: listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp> = {
            data: responseListGroup
        };
        return responseGraphDTO;
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
    async listGroupByAccountAndDay(secondsFrom: number) {
        const queryName = "groupByAccountAndDay";
        const queryValue = `:${secondsFrom}`;

        const transactions = await this.dataSource.createQueryBuilder()
            .select("acc.id as id, acc.address as address, date(from_unixtime(tr.date)) as date, tr.block as block, count(*) as totalcount, sum(cast(tr.value AS DECIMAL(20,8))) as totalvalue")
            .from(Transaction, "tr")
            .leftJoin(Account, "acc", "acc.id=tr.accountId")
            .where("tr.date>(unix_timestamp(now()) - :secondsFrom)", { secondsFrom: secondsFrom })
            .groupBy("acc.id,date(from_unixtime(tr.date))")
            .cache(queryName + queryValue, 100000)
            .getRawMany();

        this.addCache(queryName, queryValue);

        console.log(transactions);
        const responseListGroup = plainToInstance(ResponseListGroupByAccountAndTimeStamp, transactions);
        const responseGraphDTO: listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp> = {
            data: responseListGroup
        };

        return responseGraphDTO;

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

    async listGroupByAccountAndMonth(secondsFrom: number) {
        const queryName = "groupByAccountAndMonth";
        const queryValue = `:${secondsFrom}`;

        const transactions = await this.dataSource.createQueryBuilder()
            .select("acc.id as id, acc.address as address, concat(year(from_unixtime(tr.date)),'-',month(from_unixtime(tr.date))) as date, tr.block as block, count(*) as totalcount, sum(cast(tr.value AS DECIMAL(20,8))) as totalvalue")
            .from(Transaction, "tr")
            .leftJoin(Account, "acc", "acc.id=tr.accountId")
            .where("tr.date>(unix_timestamp(now()) - :secondsFrom)", { secondsFrom: secondsFrom })
            .groupBy("acc.id,concat(year(from_unixtime(tr.date)),'-',month(from_unixtime(tr.date)))")
            .cache(queryName + queryValue, 100000)
            .getRawMany();

        this.addCache(queryName, queryValue);

        const responseListGroup = plainToInstance(ResponseListGroupByAccountAndTimeStamp, transactions);
        const responseGraphDTO: listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp> = {
            data: responseListGroup
        };
        return responseGraphDTO;

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

    async addCache(queryName: string, queryValue: string, limit = false, offset = false) {
        const values = this.mapCache.get(queryName)
        if (values) {
            values.add(queryValue);
        } else {
            this.mapCache.set(queryName, (new Set<string>).add(queryValue));
        }
    }

    async deleteCache() {
        const cacheToRemove: string[] = []
        this.mapCache.forEach((x, key) => {
            x.forEach(z => {
                cacheToRemove.push(key + z);
            })
        })
        await this.dataSource.queryResultCache?.remove(cacheToRemove)
        this.mapCache = new Map<string, Set<string>>;
    }
}