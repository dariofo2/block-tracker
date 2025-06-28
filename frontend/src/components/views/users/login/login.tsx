"use client"

import AxiosAuth from "@/components/axios/axiosAuth";
import RequestUserLoginDTO from "@/components/classes/auth/dto/request-user-login.dto";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

export default function Login () {
    const [userLogin,setUserLogin]=useState({} as RequestUserLoginDTO);
    const formRef=useRef(null as HTMLFormElement|null);

    function changeInput (e:ChangeEvent) {
        const inputElem=e.target as HTMLInputElement;
        setUserLogin({
            ...userLogin,
            [inputElem.name]:inputElem.value
        })
    }

    async function submit (e:FormEvent) {
        e.preventDefault();
        formRef.current?.classList.add("was-validated");
        if (formRef.current?.checkValidity()) {
            formRef.current.classList.remove("was-validated");
            console.log(userLogin);
            const loginResponse=await AxiosAuth.login(userLogin);
        }
    }

    return (
        <div>
            <form ref={formRef} onSubmit={submit}>
                <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                    <div className="form-floating">
                        <input className="form-control" name="email" type="email" onChange={changeInput} placeholder="E-Mail" required />
                        <label>E-Mail</label>
                    </div>
                </div>
                <div className="input-group mt-3">
                    <span className="input-group-text"><i className="bi bi-key-fill"></i></span>
                    <div className="form-floating">
                        <input className="form-control" name="password" type="password" onChange={changeInput} placeholder="Password" required />
                        <label>Password</label>
                    </div>
                </div>
                <button className="btn btn-primary w-100 mt-3">Go</button>
            </form>
        </div>
    );
}