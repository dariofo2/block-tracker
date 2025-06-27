import { forwardRef, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import BullMQWorkerService from "./bullMQ.worker.service";
import BullMQClientService from "./bullMQ.client.service";
import { TransactionsModule } from "src/controllers/transactions/transactions.module";

@Module({
    imports:[
        BullModule.forRootAsync({
            useFactory: ()=>({
                connection:{
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT as string),
                    password: process.env.REDIS_PASSWORD,  
                },
                concurrency:1
            })
        }),
        BullModule.registerQueue({
            name:"transactions"
        }),
        forwardRef(()=>TransactionsModule)
    ],
    providers:[BullMQWorkerService,BullMQClientService],
    exports:[BullMQClientService]
})
export default class BullMQModule {}