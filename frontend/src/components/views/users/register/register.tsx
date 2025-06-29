"use client"

import AxiosAuth from "@/components/axios/axiosAuth";
import { CreateUserDto } from "@/components/classes/users/dto/create-user.dto";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function Register () {
    const [createUserDTO,setCreateUserDTO]=useState({} as CreateUserDto);
    const formRef=useRef(null as HTMLFormElement|null);

    function changeInput (e:ChangeEvent) {
        const inputElem=e.target as HTMLInputElement;
        setCreateUserDTO({
            ...createUserDTO,
            [inputElem.name]:inputElem.value
        })
    }

    async function submit (e:FormEvent) {
        e.preventDefault();
        formRef.current?.classList.add("was-validated");
        if (formRef.current?.checkValidity()) {
            formRef.current.classList.remove("was-validated");
            const createUserResponse=await AxiosAuth.signin(createUserDTO);
        }
    }

    return (
        <div>
            <form ref={formRef} onSubmit={submit} noValidate>
                <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                    <div className="form-floating">
                        <input className="form-control" name="name" type="text" onChange={changeInput} placeholder="Name" required />
                        <label>Name</label>
                    </div>
                </div>
                <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                    <div className="form-floating">
                        <input className="form-control" name="surname" type="text" onChange={changeInput} placeholder="Surname" required />
                        <label>Surname</label>
                    </div>
                </div>
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
            <ToastContainer containerId={"axios"}/>
        </div>
    );
}