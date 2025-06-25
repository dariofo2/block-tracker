import { Transaction } from "src/controllers/transactions/entities/transaction.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("accounts")
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @OneToMany(type=>Transaction,transaction=>transaction.id)
    transactions: Transaction[]
}
