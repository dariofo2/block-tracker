import { Transaction } from "web3";

export default class ResponseEtherscanTransactionsDTO {
    status: number;
    message: string;
    result: Transaction[]
}