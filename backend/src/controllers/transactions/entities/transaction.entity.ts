import { Account } from "src/controllers/accounts/entities/account.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fromAcc: string;

    @Column()
    toAcc: string;

    @Column()
    value: string;

    @Column()
    block: string;

    @Column()
    hash: string;

    @Column()
    isErc20: boolean;

    @Column()
    contractAddress: string;

    @Column()
    date: number;
    
    @ManyToOne(type=>Account,account=>account.id)
    account:Account
}
