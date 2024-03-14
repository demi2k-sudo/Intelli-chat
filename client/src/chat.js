import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";

export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople,setOnlinePeople] = useState({});
    const [selectedUser, setSelectedUser] =useState(null);
    const {username,id} = useContext(UserContext);
    
    useEffect(()=>{
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message',handleMessage)
    },[]);

    function showOnlinePeople(peopleArray){
        const people = {};
        peopleArray.forEach(({userId,username}) => {
           people[userId] = username; 
        });
        setOnlinePeople(people);
    }

    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        if('online' in messageData){
            showOnlinePeople(messageData.online);
        }
    }

    const onlinePeopleMinusUser = {...onlinePeople};
    delete onlinePeopleMinusUser[id];


    return(
        <div className="flex h-screen">
            <div className="bg-red-50 w-1/3 pl-4 pt-4">
                <Logo/>
                
                {Object.keys(onlinePeopleMinusUser).map(userId =>(
                    
                    <div onClick={()=>setSelectedUser(userId)} className={"border-b flex border-gray-100 py-2 px-1 gap-2 items-center cursor-pointer "+(userId===selectedUser?"bg-red-500 rounded-lg mr-2":"")}>
                        <Avatar username = {onlinePeople[userId]} userId = {userId}/>
                        <span className="text-gray-800">{onlinePeople[userId]}</span>
                    </div>
                ))}
            </div>
            <div className="bg-red-300 w-2/3 p-2 flex flex-col">
                <div className="flex-grow">messages</div>
                <div className="flex gap-2 ">
                    <input type='text' placeholder="Enter your message here" className="rounded-lg flex-grow bg-white border p-2"></input>
                    <button className="p-2 rounded-lg text-white bg-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}