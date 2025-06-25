import { Injectable } from '@nestjs/common';
import Web3, { Contract, ContractAbi } from 'web3';
import * as erc20Json from "./abi/erc-20.json";
import { ERC20Data } from './classes/erc-20-Data';

@Injectable()
export class Web3Service {
    node = new Web3(process.env.ETH_INFURA_NODE);
    erc20Contract=new this.node.eth.Contract(erc20Json.abi);
    contractERC20DataMap= new Map<string,ERC20Data>;

    async decodeMethodDataERC20 (input:string) {
        const method=input.slice(0,10);
        const params="0x" + input.slice(10);

        const parametersDecoded=this.node.eth.abi.decodeParameters([
            "address",
            "uint256"
        ], params);

        const methodName=await this.getMethodNameERC20(method);

        parametersDecoded[2]=methodName;
        return {parametersDecoded};
    }

    async getMethodNameERC20 (method:string) {
        for (const item of erc20Json.abi) {
            const toSignName= item.name;
            const toSignInputs= item.inputs?.map(i=>i.type).join(",");
            const toSignAll= toSignName + "(" + toSignInputs + ")";

            const signature=this.node.utils.sha3(toSignAll);
            if (method==signature?.slice(0,10)) return toSignName; 
        } 
    }

    /**
     * Get Name - Decimals - Symbol of ERC-20 using standard ERC-20
     * Uses a Map, first time Checks in node, second time Checks in map
     */
    async getDataOfERC20Token (contractAddress:string) : Promise<ERC20Data> {
        if (this.contractERC20DataMap.has(contractAddress)) {
            return this.contractERC20DataMap.get(contractAddress) as ERC20Data;
        }
        const contract=new this.node.eth.Contract(erc20Json.abi,contractAddress);

        const eRC20Data : ERC20Data = {
            name: await contract.methods.name().call(),
            symbol: await contract.methods.symbol().call(),
            decimals: await contract.methods.decimals().call()
        };

        this.contractERC20DataMap.set(contractAddress,eRC20Data);

        return eRC20Data;
    }
}
