import cookie from "js-cookie"
import { User } from "../classes/users/entities/user.entity"
import axios, { AxiosError } from "axios";
import RequestUserLoginDTO from "../classes/auth/dto/request-user-login.dto";
import ResponseUserLoginDTO from "../classes/auth/dto/reponse-user-login.dto";
import { toast } from "react-toastify";
import AxiosErrors from "./axiosErrors";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "../classes/users/dto/create-user.dto";
import { redirect } from "next/navigation";
export default class AxiosAuth {
    static backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

    /**
     * Sign in User. Creates a New User
     * @param createUserDTO 
     * @returns 
     */
    static async signin(createUserDTO: CreateUserDto) : Promise<User> {
        try {
            const userResponse = await axios.post<User>(
                `${this.backendURL}/auth/signin`,
                createUserDTO,
                {
                    withCredentials: true
                }
            );
            toast.success("User Created Succesfull", { containerId: "axios" });
            return userResponse.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }

    /**
     * Login User. Logs in a new User
     * @param userRequestLoginDTO 
     * @returns 
     */
    static async login(userRequestLoginDTO: RequestUserLoginDTO): Promise<ResponseUserLoginDTO> {
        try {
            const userResponse = await axios.post<ResponseUserLoginDTO>(
                `${this.backendURL}/auth/login`,
                userRequestLoginDTO,
                {withCredentials:true} 
            );
            toast.success("Login Succesfull", { containerId: "axios" });
            this.setUserCookies(plainToInstance(User, userResponse.data));
            return userResponse.data;
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }

    /**
     * Logouts an user
     */
    static async logout() {
        try {
            await axios.post(
                `${this.backendURL}/auth/logout`,
                {},
                {
                    withCredentials: true
                }
            );
            toast.success("Logout Succesfull", { containerId: "axios" });
            await this.removeUserCookies();
            
        } catch (error) {
            await AxiosErrors.axiosError(<AxiosError>error);
            throw error;
        }
    }

    /**
     * Set user Cookies For info Purposes
     * @param user 
     */
    static async setUserCookies(user: User) {
        cookie.set("user", JSON.stringify(user));
    }

    /**
     * Remove user Cookies Completelly
     */
    static async removeUserCookies() {
        cookie.remove("user");
    }
}