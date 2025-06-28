import { AxiosError } from "axios";
import AxiosAuth from "./axiosAuth";
import { toast } from "react-toastify";

export default class AxiosErrors {
    /**
     * Middleware Handler for AxiosErrors
     * If 401 logouts completely the user to sending to Log In View Again
     * If Normal error (Or Array of Errors) sends message Errors to Toastify
     * @param axiosError
     */
    static async axiosError (axiosError:AxiosError) {
        if (axiosError.status==401) {
            await AxiosAuth.logout();
            throw new AxiosError("Authentication Error. Please Log-In Again");
        }

        const messages=(axiosError.response?.data as any).message
        if (messages instanceof Array) {
            messages.forEach(x=>{
                toast.error(x,{containerId:"axios"});
            })
        } else {
            toast.error(messages,{containerId:"axios"});
        }
    }
}