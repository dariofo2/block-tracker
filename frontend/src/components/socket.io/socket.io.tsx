import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

class Props {
    onUpdate=()=>{}
}
export default function SocketIoClient (props:Props) {
    const socket=useRef(null as Socket|null);
    const URLBackend= process.env.NEXT_PUBLIC_BACKEND_URL as string;

    useEffect(()=>{
        if (!socket.current) {
            socket.current=io(URLBackend,{
                transports:["websocket"]
            });
            socket.current.on("connection",()=>{
                console.log("Conectado a WebSockets");
            })
            socket.current.on("refresh",()=>{
                props.onUpdate();
            })
        }
    })
    
    return (
        <div></div>    
    )
}