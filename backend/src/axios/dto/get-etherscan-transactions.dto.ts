export default class GetEtherscanTransactionsDTO {
    address: string;
    startblock: number;
    endblock: number;
    page: number;
    offset:number;
    sort: "asc"|"desc";
    module: string;
    action: string;
}