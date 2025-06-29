import { useEffect } from "react"
import { io, Socket } from "socket.io-client"

class Props {
    onUpdate=()=>{}
}
export default function SocketIoClient (props:Props) {
    let doOnce=false;
    const URLBackend= process.env.NEXT_PUBLIC_BACKEND_URL as string;

    useEffect(()=>{
        if (doOnce) {
            const socket=io(URLBackend,{
                transports:["websockets"]
            });
            socket.on("connection",()=>{
                console.log("Conectado a WebSockets");
            })
            socket.on("refresh",()=>{
                props.onUpdate();
            })
        } else {
            doOnce=true;
        }
    })
    
    return (
        <div></div>    
    )
}