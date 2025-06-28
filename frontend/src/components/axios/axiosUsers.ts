import { toast } from "react-toastify";
import { User } from "../classes/users/entities/user.entity";
import AxiosErrors from "./axiosErrors";
import axios, { AxiosError } from "axios";

export default class AxiosUsers {
    static backendURL=process.env.NEXT_PUBLIC_BACKEND_URL

    /**
     * Create an Account
     * @param createAccountDTO 
     * @returns Promise of Account
     */
    static async list () : Promise<User[]> {
       try {
        const usersResponse=await axios.post<User[]>(
            `${this.backendURL}/users/list`,
            {},
            {
                withCredentials:true
            }
        );
        toast.success("Listed Users Sucesfull",{containerId:"axios"});
        return usersResponse.data;
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