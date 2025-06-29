import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass, plainToInstance } from "class-transformer";
import { CreateAccountDto } from "src/controllers/accounts/dto/create-account.dto";
import {ListAccountsLastBlockDTO } from "src/controllers/accounts/dto/list-account-lastBlock.dto";
import { Account } from "src/controllers/accounts/entities/account.entity";
import { ListRequestDatatablesDTO } from "src/database/dto/listRequestDatatables.dto";
import { ListResponseDatatablesDTO } from "src/database/dto/listResponseDatatables.dto";
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

    async list (listRequestDatatablesDTO:ListRequestDatatablesDTO) : Promise<ListResponseDatatablesDTO<Account>> {
        const listAccountsResponse=await this.dataSource.createQueryBuilder()
        .select("accounts")
        .from(Account,"accounts")
        .where("address like :search",{search:listRequestDatatablesDTO.searchValue})
        .orderBy(listRequestDatatablesDTO.orderName,listRequestDatatablesDTO.orderDirection as "ASC"|"DESC")
        .limit(listRequestDatatablesDTO.limit)
        .offset(listRequestDatatablesDTO.offset)
        .getManyAndCount()
        
        const responseListDTO: ListResponseDatatablesDTO<Account> = {
            draw:listRequestDatatablesDTO.draw,
            data:listAccountsResponse[0],
            recordsFiltered:listAccountsResponse[1],
            recordsTotal: await this.accountsRepository.count()
        }

        //const listAccountsResponse=await this.accountsRepository.find();
        return responseListDTO;
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

}