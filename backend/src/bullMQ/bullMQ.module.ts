import { Module } from "@nestjs/common";
import BullMQService from "./bullMQ.service";

@Module({
    providers:[BullMQService],
    exports:[BullMQService]
})
export default class BullMQModule {}