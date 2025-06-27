import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job } from "bullmq";
import { TransactionsService } from "src/controllers/transactions/transactions.service";

@Processor("transactions",{concurrency:1})
export default class BullMQWorkerService extends WorkerHost {
    constructor (
        private transactionsService: TransactionsService
    ) {super();}
    async process (job: Job<any,any,string>) : Promise<any> {
        switch (job.name) {
            case 'refreshTransactions': {
                //Always Await 1 Second Because max Calls per Second in Etherscan
                await new Promise(res => setTimeout(res, 1000));
                await this.transactionsService.refreshNewTransactionsOfAccounts(job.data['accounts']);
                console.log("Hecha");
                return {};
            }
        }
    }
}