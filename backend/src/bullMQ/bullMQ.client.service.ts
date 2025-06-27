import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { ListAccountsLastBlockDTO } from "src/controllers/accounts/dto/list-account-lastBlock.dto";

@Injectable()
export default class BullMQClientService {
    constructor (
        @InjectQueue("transactions") private transactionsQueue: Queue
    ) {}

    async addTransactionsRefreshJob (accounts:ListAccountsLastBlockDTO[]) {
        this.transactionsQueue.add("refreshTransactions",
            {
                accounts: accounts
            }
        )
    }

    async waitUntilFinishedJobs () {
        const waitUntilFinished=new Promise((res)=>{
            const intval=setInterval(async ()=>{
                const jobCounts=await this.transactionsQueue.getJobCounts();
                if (jobCounts.waiting <=0 && jobCounts.active<=0) {
                    clearInterval(intval);
                    res(true);
                }
            },1000)
        })

        return waitUntilFinished;
    }

}