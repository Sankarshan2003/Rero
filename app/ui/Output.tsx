import { useState,useEffect } from 'react'
import io from 'socket.io-client'
import clsx from 'clsx'
import { getCookie } from 'cookies-next'
interface messageFormat{
    print: string;
    type :'info'|'error';
}
export default function Output()
{
    const [logs,setlogs] = useState<messageFormat[]>([])
    useEffect(()=>{
        const cookie = getCookie('JWTtoken')
        console.log(cookie)
        const socket = io('http://localhost:8080',{
            extraHeaders :{
                'AUTHORIZATION':`${cookie}`
            }
        })
        socket.on('print',(msg:messageFormat)=>{
            console.log(msg)
            setlogs((prevlogs)=>[...prevlogs,msg])
        })
        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
          });
      
          // Cleanup when the component unmounts
          return () => {
            
            socket.disconnect();
          };
    },[])
    const msgs = logs.map((log,index)=>{
        return <div key={index} className={log.type==='info'?'text-black':'text-red-600'}>{log.print}</div>
    })
    return (
        <div className="basis-1/2 bg-[#1e1e1e] h-screen overflow-scroll">
            {msgs}
        </div>
    )
}