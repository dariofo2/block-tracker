import { Transaction } from "src/controllers/transactions/entities/transaction.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    account: string;

    @OneToMany(type=>Transaction,transaction=>transaction.id)
    transactions: Transaction[]
}
