"use client"

import { Modal } from "bootstrap";

class Props {
    confirmDelete= ()=>{}
}
export default function DeleteAccountModal (props:Props) {
    async function confirmDelete () {
        Modal.getOrCreateInstance("#deleteAccountModal").hide();
        props.confirmDelete();
    }
    return (
        <div className="modal fade" id="deleteAccountModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Create Account</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <h6>Do you want to delete this Account?</h6>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={confirmDelete}>Understood</button>
                    </div>
                </div>
            </div>
        </div>
    ); 
}