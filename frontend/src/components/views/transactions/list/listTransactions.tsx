"use client"
import DataTable, { DataTableRef } from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import Responsive from "datatables.net-responsive";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { plainToClass } from "class-transformer";
import { ToastContainer } from "react-toastify";
import { Account } from "@/components/classes/accounts/entity/account.entity";
import { ListRequestDatatablesDTO } from "@/components/classes/datatables/listRequestDatatables.dto";
import AxiosAccounts from "@/components/axios/axiosAccounts";
import AxiosTransactions from "@/components/axios/axiosTransactions";
import moment from "moment";

DataTable.use(DT);
export default function TransactionsList () {
    const dataTableElem= useRef(null as DataTableRef|null);
    
    useEffect(()=>{
    })
        
    const columns= [
        {data: "id", name:"id"},
        {data: "account.address", name: "accounts.address"},
        {data: "fromAcc", name: "fromAcc"},
        {data: "toAcc", name: "toAcc"},
        {data: "value", name: "value"},
        {data: "block", name: "block"},
        {data: "hash", name: "hash"},
        {data: "isErc20", name: "isErc20"},
        {data: "contractAddress", name: "contractAddress"},
        {data: "method", name: "method"},
        {data: "name", name: "name"},
        {name:"symbol", data: "symbol", defaultContent:""},
        {name:"decimals",data:"decimals", defaultContent:""},
        {data: "date", name: "date"},
        {name:"actions",data:null, defaultContent:""},
    ];

    async function sendToAccount (id:number) {
        window.location.href=`/admin/accounts/view?id=${id}`;
    }

    async function showConfirmModal () {
        Modal.getOrCreateInstance("#confirmAccountsListAdminModal").show();
    }
    
    return (
        <div>
        <DataTable 
            ref={dataTableElem}
            columns={columns}
            
            slots= {{
                13: (data:any,row:Account) => {
                    return <span>{moment.unix(data).format("DD/MM/Y hh:mm:ss")}</span>
                },
                /*
                5: (data:any,row:Account) => {
                    if (row.type=="blocked") return <span className="bi bi-ban text-sucess cursor-pointer" onClick={()=>unlockAccount(row)}></span> 
                    else return <span className="bi bi-ban text-danger" style={{cursor:"pointer"}} onClick={()=>blockAccount(row)}></span>
                }
                    */
            }}
            
            options={{
                serverSide:true, 
                responsive: {
                    details: {
                        renderer: Responsive.Responsive.renderer.listHiddenNodes() as any
                    }
                },
                paging:true,
                ajax: async function (data, callback, settings) {
                    const dataProcess=data as any;
                    const listRequestDatatablesDTO: ListRequestDatatablesDTO = {
                        orderName:dataProcess.order[0].name,
                        orderDirection:(dataProcess.order[0].dir as string).toUpperCase(),
                        searchValue:`%${dataProcess.search.value}%`,
                        limit:dataProcess.length,
                        offset:dataProcess.start,
                        draw: dataProcess.draw,
                        data:{}
                        
                    }
                    console.log(listRequestDatatablesDTO)
                    const response= await AxiosTransactions.list(listRequestDatatablesDTO);
                    console.log(response);
                    callback(response);
                },
                order:[[1,"asc"]], 
                ordering:true, 
                columnDefs: [
                    {targets:[0,1,2,3,4,5,6,7,8,9,10,11,12,13], orderable:true, orderSequence:["asc","desc"]},
                    {targets: [14], orderable:false}
                ],
            }} 
                className="display table table-hover"
            >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ADDRESS</th>
                    <th>FROM</th>
                    <th>TO</th>
                    <th>VALUE</th>
                    <th>BLOCK</th>
                    <th>HASH</th>
                    <th>ISERC20</th>
                    <th>CONTRACT</th>
                    <th>METHOD</th>
                    <th>NAME</th>
                    <th>SYMBOL</th>
                    <th>DECIMALS</th>
                    <th>DATE</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
        </DataTable>
        </div>
    );
}