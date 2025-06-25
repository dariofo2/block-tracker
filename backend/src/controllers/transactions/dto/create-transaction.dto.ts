export class CreateTransactionDto {
        fromAcc: string;    
        toAcc: string;    
        value: string;    
        block: string;    
        hash: string;    
        isErc20: boolean;    
        contractAddress?: string;
        method?: string;
        name?: string;
        symbol?: string;
        decimals?: string;
        date: number;
        account: {
                id: number
        };
}
