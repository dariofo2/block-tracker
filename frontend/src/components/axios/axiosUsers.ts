import { toast } from "react-toastify";
import { User } from "../classes/users/entities/user.entity";
import AxiosErrors from "./axiosErrors";
import axios, { AxiosError } from "axios";
import { ListRequestDatatablesDTO } from "../classes/datatables/listRequestDatatables.dto";
import { ListResponseDatatablesDTO } from "../classes/datatables/listResponseDatatables.dto";

export default class AxiosUsers {
    static backendURL=process.env.NEXT_PUBLIC_BACKEND_URL

     /**
     * List Transactions
     * @returns 
     */
    static async list (listRequestDatatablesDTO: ListRequestDatatablesDTO) : Promise<ListResponseDatatablesDTO<User>> {
        try {
        const accountsList=await axios.post<ListResponseDatatablesDTO<User>>(
            `${this.backendURL}/users/list`,
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

    static async get (id:number) : Promise<User> {
        try {
        const userResponse=await axios.post<User>(
            `${this.backendURL}/users/get`,
            {id:id},
            {
                withCredentials:true
            }
        );
        toast.success("Get User Sucesfull",{containerId:"axios"});
        return userResponse.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        } 
    }
}