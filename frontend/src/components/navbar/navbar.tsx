"use client"
import { redirect } from "next/navigation";
import AxiosAuth from "../axios/axiosAuth";
import { User } from "../classes/users/entities/user.entity"

class Props {
    user?: User
}

export default function NavBar(props: Props) {
    const user = props.user;

    async function logout () {
        await AxiosAuth.logout()
        redirect("/");
    }

    if (!user) return (
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Block Tracker</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        
                    </ul>
                    <ul className="navbar-nav d-flex align-items-center">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Log In</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/users/register">Sign In</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )

    if (user && user.role as number == 1) return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Block Tracker</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/accounts/list" aria-current="page">Accounts</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/transactions/list">Transactions</a>
                        </li>
                        {/*}
                        <li className="nav-item">
                            <a className="nav-link">Users</a>
                        </li>
                        {*/}
                        <li className="nav-item">
                            <a className="nav-link" href="/graphs/accounts" aria-disabled="true">Graphs</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav d-flex align-items-center">
                        <li className="nav-item">
                            <a className="nav-link" href="/users/view">{user.email}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" style={{cursor:"pointer"}} onClick={logout}>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )

    if (user && user.role as number == 2) return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Block Tracker</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/accounts/list">Accounts</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/transactions/list">Transactions</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/graphs/accounts" aria-disabled="true">Graphs</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Users</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav d-flex align-items-center">
                        <li className="nav-item">
                            <a className="nav-link" href="#">{user.email}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" style={{cursor:"pointer"}} onClick={logout}>Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}