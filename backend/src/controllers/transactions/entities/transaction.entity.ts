import { Account } from "src/controllers/accounts/entities/account.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("transactions")
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
    method: string;

    @Column()
    name: string;

    @Column()
    symbol: string;

    @Column()
    decimals: string;

    @Column()
    date: number;
    
    @ManyToOne(()=>Account,account=>account.id)
    account:Account
}
