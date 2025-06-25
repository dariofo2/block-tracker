import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/controllers/accounts/entities/account.entity';
import { Transaction } from 'src/controllers/transactions/entities/transaction.entity';
import { AccountsRepository } from './repository/accounts/accounts.repository';
import { TransactionsRepository } from './repository/transactions/transactions.repository';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useFactory: ()=>({
                type:<"mysql"|"postgres">process.env.DB_TYPE,
                host:process.env.DB_HOST,
                port: parseInt(<string>process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [Account,Transaction]
            })
        }),
        TypeOrmModule.forFeature([Account,Transaction])
    ],
    providers: [
        AccountsRepository,
        TransactionsRepository
    ],
    exports: [
        TypeOrmModule,
        AccountsRepository,
        TransactionsRepository
    ]
})
export class DBModule {}
