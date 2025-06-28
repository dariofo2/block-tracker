import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import AxiosErrors from "./axiosErrors";
import { CreateAccountDto } from "../classes/accounts/dto/create-account.dto";
import { Account } from "../classes/accounts/entity/account.entity";

export default class AxiosAccounts {
    static backendURL=process.env.NEXT_PUBLIC_BACKEND_URL

    /**
     * Create an Account
     * @param createAccountDTO 
     * @returns Promise of Account
     */
    static async create (createAccountDTO:CreateAccountDto) : Promise<Account> {
       try {
        const accountResponse=await axios.post<Account>(
            `${this.backendURL}/accounts/create`,
            createAccountDTO,
            {
                withCredentials:true
            }
        );
        toast.success("Account Created Succesfully",{containerId:"axios"});
        return accountResponse.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        } 
    }

    /**
     * Delete an Account
     * @param id 
     * @returns 
     */
    static async delete (id:number) : Promise<Account> {
        try {
        const accountResponse=await axios.post<Account>(
            `${this.backendURL}/accounts/delete`,
            {id:id},
            {
                withCredentials:true
            }
        );
        toast.success("Account Deleted Succesfully",{containerId:"axios"});
        return accountResponse.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }

    /**
     * List Accounts
     * @returns 
     */
    static async list () : Promise<Account[]> {
        try {
        const accountsList=await axios.post<Account[]>(
            `${this.backendURL}/accounts/list`,
            {},
            {
                withCredentials:true
            }
        );
        toast.success("List Accounts Sucessfully",{containerId:"axios"});
        return (await accountsList).data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }

    /**
     * Get an Account
     * @param id 
     * @returns 
     */
    static async get (id:number) : Promise<Account> {
        try {
        const account=await axios.post<Account>(
            `${this.backendURL}/accounts/get`,
            {id:id},
            {
                withCredentials:true
            }
        );
        toast.success("Get Accounts Succesfully",{containerId:"axios"});
        return account.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }
}