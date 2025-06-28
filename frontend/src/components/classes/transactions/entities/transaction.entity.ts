import { Account } from "../../accounts/entity/account.entity";
export class Transaction {
    id?: number;
    fromAcc?: string;
    toAcc?: string;
    value?: string;
    block?: string;
    hash?: string;
    isErc20?: boolean;
    contractAddress?: string;
    method?: string;
    name?: string;
    symbol?: string;
    decimals?: string;
    date?: number;
    account?:Account;

}
