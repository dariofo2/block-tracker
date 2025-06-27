import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { ListAccountsLastBlockDTO } from "src/controllers/accounts/dto/list-account-lastBlock.dto";

@Injectable()
export default class BullMQClientService {
    constructor (
        @InjectQueue("transactions") private transactionsQueue: Queue
    ) {}

    async addTransactionsRefreshJob (accounts:ListAccountsLastBlockDTO[],delay:number) {
        this.transactionsQueue.add("refreshTransactions",
            {
                accounts: accounts
            },
            {
                delay:0
            }
        )
    }

    async waitUntilFinishedJobs () {
        const waitUntilFinished=new Promise((res)=>{
            setInterval(async ()=>{
                const jobCounts=await this.transactionsQueue.getJobCounts();
                if (jobCounts.waiting <=0 && jobCounts.active<=0) {
                    res(true);
                }
            },1000)
        })

        return waitUntilFinished;
    }

}