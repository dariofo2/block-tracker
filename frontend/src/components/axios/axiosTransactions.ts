import axios, { AxiosError } from "axios";
import listRequestGraphsDTO from "../classes/database/dto/listRequestGraphs.dto";
import { RequestListGroupByAccountAndTimeStamp } from "../classes/transactions/dto/list/requestListGroupByAccountAndTimeStamp.dto";
import listReponseGraphsDTO from "../classes/database/dto/listResponseGraphs.dto";
import { ResponseListGroupByAccountAndTimeStamp } from "../classes/transactions/dto/list/responseListGroupByAccountAndTimeStamp.dto";
import { toast } from "react-toastify";
import AxiosErrors from "./axiosErrors";

export default class AxiosTransactions {
    /** Backend url from .env */
    static backendURL=process.env.NEXT_PUBLIC_BACKEND_URL

    static async listGroupByAccountsAndTime (listRequestGraphsDTO:listRequestGraphsDTO<RequestListGroupByAccountAndTimeStamp>) :Promise<listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp>> {
        try {
        const transactionsResponse=await axios.post<listReponseGraphsDTO<ResponseListGroupByAccountAndTimeStamp>>(
            `${this.backendURL}/transactions/listGroupByAccountsAndTime`,
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
