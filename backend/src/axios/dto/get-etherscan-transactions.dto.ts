export default class GetEtherscanTransactionsDTO {
    address: number;
    startblock: number;
    endblock: number;
    page: number;
    offset:number;
    sort: "asc"|"desc";
    module: string;
    action: string;
}