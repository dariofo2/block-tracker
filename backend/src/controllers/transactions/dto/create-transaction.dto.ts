export class CreateTransactionDto {
        fromAcc: string;
    
        toAcc: string;
    
        value: string;
    
        block: string;
    
        hash: string;
    
        isErc20: boolean;
    
        contractAddress: string;
    
        date: number;

        account: {
                id: number
        };
        
}
