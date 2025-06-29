import axios, { AxiosError } from "axios";
import listRequestGraphsDTO from "../classes/database/dto/listRequestGraphs.dto";
import { RequestListGroupByAccountAndTimeStamp } from "../classes/transactions/dto/list/requestListGroupByAccountAndTimeStamp.dto";
import listReponseGraphsDTO from "../classes/database/dto/listResponseGraphs.dto";
import { ResponseListGroupByAccountAndTimeStamp } from "../classes/transactions/dto/list/responseListGroupByAccountAndTimeStamp.dto";
import { toast } from "react-toastify";
import AxiosErrors from "./axiosErrors";
import { ListRequestDatatablesDTO } from "../classes/datatables/listRequestDatatables.dto";
import { ListResponseDatatablesDTO } from "../classes/datatables/listResponseDatatables.dto";
import { Transaction } from "../classes/transactions/entities/transaction.entity";

export default class AxiosTransactions {
    /** Backend url from .env */
    static backendURL=process.env.NEXT_PUBLIC_BACKEND_URL

    /**
     * List Transactions Using DataTables
     * @returns 
     */
    static async list (listRequestDatatablesDTO: ListRequestDatatablesDTO) : Promise<ListResponseDatatablesDTO<Transaction>> {
        try {
        const accountsList=await axios.post<ListResponseDatatablesDTO<Transaction>>(
            `${this.backendURL}/transactions/list`,
            listRequestDatatablesDTO,
            {
                withCredentials:true
            }
        );
        toast.success("List Accounts Sucessfully",{containerId:"axios"});
        return accountsList.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }

    /**
     * List Transactions By Account Id Using Datatables
     * @returns 
     */
    static async listByAccountId (listRequestDatatablesDTO: ListRequestDatatablesDTO) : Promise<ListResponseDatatablesDTO<Transaction>> {
        try {
        const accountsList=await axios.post<ListResponseDatatablesDTO<Transaction>>(
            `${this.backendURL}/transactions/listByAccountId`,
            listRequestDatatablesDTO,
            {
                withCredentials:true
            }
        );
        toast.success("List Accounts Sucessfully",{containerId:"axios"});
        return accountsList.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }

    /**
     * List Graphs for Accounts
     * @param listRequestGraphsDTO 
     * @returns 
     */
    static async listGraphsAccounts (listRequestGraphsDTO:listRequestGraphsDTO<RequestListGroupByAccountAndTimeStamp>) :Promise<listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp>> {
        try {
        const transactionsResponse=await axios.post<listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp>>(
            `${this.backendURL}/transactions/listGraphsAccounts`,
            listRequestGraphsDTO,
            {
                withCredentials:true
            }
        );
        toast.success("Listed Graphs of Accounts",{containerId:"axios"});
        return transactionsResponse.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }
}
