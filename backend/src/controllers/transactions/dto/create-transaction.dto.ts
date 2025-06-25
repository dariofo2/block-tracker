export class CreateTransactionDto {
        accountId: number;
        
        fromAcc: string;
    
        toAcc: string;
    
        value: string;
    
        block: string;
    
        hash: string;
    
        isErc20: boolean;
    
        contractAddress: string;
    
        date: number;
        
}
