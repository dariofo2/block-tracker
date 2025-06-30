import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import AxiosModule from 'src/axios/axios.module';

@Module({
    imports:[AxiosModule],
    providers:[Web3Service],
    exports: [Web3Service]
})
export class Web3Module {}
