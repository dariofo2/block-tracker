import { Transaction } from "src/controllers/transactions/entities/transaction.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Account {
    @Column()
    id: number;

    @Column()
    account: string;

    @OneToMany(type=>Transaction,transaction=>transaction.id)
    transactions: Transaction[]
}
