import { Transaction } from "web3";
import TransactionEtherscanDTO from "./transaction-etherscan.dto";

export default class ResponseEtherscanTransactionsDTO {
    status: number;
    message: string;
    result: TransactionEtherscanDTO[]
}