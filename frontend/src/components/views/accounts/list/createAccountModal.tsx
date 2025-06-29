"use client"
import AxiosAccounts from "@/components/axios/axiosAccounts";
import { CreateAccountDto } from "@/components/classes/accounts/dto/create-account.dto";
import { Modal } from "bootstrap";
import { ChangeEvent, useRef, useState } from "react";

class Props {
    onCreate=()=>{}
}
export default function CreateAccountModal(props:Props) {
    const [createAccountDTO,setCreateAccountDTO]=useState({} as CreateAccountDto|null);
    const formElem=useRef(null as HTMLFormElement|null);

    async function onChangeInput (e:ChangeEvent) {
        const elemInput=e.target as HTMLInputElement;
        setCreateAccountDTO({
            ...createAccountDTO,
            [elemInput.name]:elemInput.value
        })
    }

    async function createAccount () {
        formElem.current?.classList.add("was-validated");
        if (formElem.current?.checkValidity()) {
            formElem.current?.classList.remove("was-validated");
            const accountResponse=await AxiosAccounts.create(createAccountDTO as CreateAccountDto);
            hideModal();
            props.onCreate();
        }
    }

    async function hideModal () {
        Modal.getOrCreateInstance("#createAccountModal").hide();
    }

    return (
        <div className="modal fade" id="createAccountModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Create Account</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form ref={formElem} noValidate>
                            <label className="form-label">Address</label>
                            <input className="form-control" type="text" name="address" placeholder="Address" onChange={onChangeInput} required/>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={createAccount}>Understood</button>
                    </div>
                </div>
            </div>
        </div>
    );
}