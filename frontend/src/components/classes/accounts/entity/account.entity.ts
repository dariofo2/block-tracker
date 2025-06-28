import { Transaction } from "../../transactions/entities/transaction.entity";

export class Account {
    id?: number;
    address?: string;
    transactions?: Transaction[]

}
