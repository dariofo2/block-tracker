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
import AxiosUsers from "@/components/axios/axiosUsers";

DataTable.use(DT);
export default function UsersList () {
    const dataTableElem= useRef(null as DataTableRef|null);
    
    useEffect(()=>{
    })
        
    const columns= [
        {data: "id", name:"id"},
        {data: "name", name: "name"},
        {data: "surname", name: "surname"},
        {data: "email", name: "email"},
        {data: "role", name: "role"},
        {name:"update", data: null, defaultContent:""},
        {name:"delete",data:null, defaultContent:""}
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
                5: (data:any,row:Account) => {
                    return <span className="bi bi-person-fill-gear text-primary" style={{cursor:"pointer"}} onClick={()=>{}}></span>
                },
                6: (data:any,row:Account) => {
                    return <span className="bi bi-trash text-danger" style={{cursor:"pointer"}} onClick={()=>{}}></span>
                }
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
                    const response= await AxiosUsers.list(listRequestDatatablesDTO);
                    console.log(response);
                    callback(response);
                },
                order:[[1,"asc"]], 
                ordering:true, 
                columnDefs: [
                    {targets:[0,1,2,3], orderable:true, orderSequence:["asc","desc"]},
                    {targets: [4,5], orderable:false}
                ],
            }} 
                className="display table table-hover"
            >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>SURNAME</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th>UPDATE</th>
                    <th>DELETE</th>
                </tr>
            </thead>
        </DataTable>
        </div>
    );
}