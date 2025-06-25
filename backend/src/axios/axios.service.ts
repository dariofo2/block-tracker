import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import GetTransactionsDTO from "./dto/get-etherscan-transactions.dto";
import { lastValueFrom } from "rxjs";
import { Transaction } from "web3";
import ResponseEtherscanTransactionsDTO from "./dto/response-etherscan-transactions.dto";

@Injectable()
export default class AxiosService {
    etherscanURL = process.env.ETH_ETHERSCAN_URL as string;
    etherscanAPI_KEY= process.env.ETH_ETHERSCAN_API_KEY as string;
    
    constructor (
        private axios: HttpService
    ) {}
    /**
     * Gets Transactions from Account
     */
    async getTransactionsOfAccount (getTransactionsDTO: GetTransactionsDTO) : Promise<Transaction[]|null> {
        try {
        const transactions=await lastValueFrom (this.axios.get<ResponseEtherscanTransactionsDTO>(
            this.etherscanURL,
            {
                params: {
                    ...getTransactionsDTO,
                    apikey: this.etherscanAPI_KEY
                }
            }
        )) 

        return transactions.data.result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}