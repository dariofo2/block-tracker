import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
    node = new Web3(process.env.ETH_INFURA_NODE);
    etherscan_API_KEY = process.env.ETH_ETHERSCAN_API_KEY;
    etherscan_URL = process.env.HOLA
}
