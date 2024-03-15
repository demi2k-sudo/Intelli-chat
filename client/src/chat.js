import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import {uniqBy} from "lodash";
import axios from "axios";
export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople,setOnlinePeople] = useState({});
    const [selectedUser, setSelectedUser] =useState(null);
    const {username,id} = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const messageRef = useRef();
    
    useEffect(()=>{
        connectToWs();
        },[]);
    
    function connectToWs(){
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message',handleMessage);
        ws.addEventListener('close',()=>{
            setTimeout(() => {
                console.log('Disconnected, Trying to connect!');
                connectToWs();
            }, 1000);
        });
    
    }

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
        else if ('text' in messageData){
            setMessages((prev) => [...prev, {...messageData}])
        }
    }

    function sendMessage(ev){
        ev.preventDefault();
        ws.send(JSON.stringify({
            
                recipient:selectedUser,
                text: newMessageText,
            
        }));
        var messageData2 = {text : newMessageText, sender:id, recipient:selectedUser, _id:Date.now()}
        setMessages((prev) => [...prev, {...messageData2}])
        
        setNewMessageText('');
        
    }

    useEffect(()=>{
        const div = messageRef.current;
        if(div){    
            div.scrollIntoView({behavior:'smooth'});
        }
    },[messages]);

    useEffect(()=>{
        if(selectedUser){
            axios.get('/messages/'+selectedUser).then(res=>{
                setMessages(res.data);

            });
        }
    },[selectedUser])

    const onlinePeopleMinusUser = {...onlinePeople};
    delete onlinePeopleMinusUser[id];
    const UniqueMessages = uniqBy(messages, '_id')


    return(
        <div className="flex h-screen">
            <div className="bg-red-100 w-1/3 pl-4 pt-4">
                <Logo/>
                
                {Object.keys(onlinePeopleMinusUser).map(userId =>(
                    <div onClick={()=>setSelectedUser(userId)} className={"border-b flex border-gray-100 py-2 px-1 gap-2 items-center cursor-pointer "+(userId===selectedUser?"bg-red-500 rounded-lg mr-2":"")}>
                        {userId === selectedUser && (
                            <div className="w-1 bg-red-400 rounded-lg h-12">

                            </div>
                        )}
                        <Avatar username = {onlinePeople[userId]} userId = {userId}/>
                        <span className="text-gray-800">{onlinePeople[userId]}</span>
                    </div>
                ))}
            </div>
            <div className="bg-red-300 w-2/3 p-2 flex flex-col">
                <div className="flex-grow">
                    {!selectedUser && (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-gray-500">
                                Welcome to Intellichat &rarr;
                            </div>
                        </div>
                    )}
                </div>
                {!!selectedUser&&(
                    <div className="relative h-full">
                        <div className="overflow-y-scroll absolute inset-0">{UniqueMessages.map((message)=>(
                        <div className={(message.sender===id)?"text-right":"text:left"}>
                            <div className={"inline-block p-2 mb-2 mr-2 text-left rounded-b-xl max-w-80 text-sm "+(message.sender===id?'rounded-tl-xl text-white bg-red-500 ':'rounded-tr-xl bg-white text-gray-500')}>
                            
                            {message.text}
                        </div>
                    </div>
                    ))}
                    <div ref={messageRef}></div>
                    </div>
                    </div>
                )}
                {!!selectedUser &&(
                    <form className="flex gap-2 " onSubmit={sendMessage}>
                    <input type='text reset'
                        onChange={ev=>setNewMessageText(ev.target.value)} 
                        placeholder="Enter your message here"  
                        className="rounded-lg flex-grow bg-white border p-2"></input>
                        <button type="submit" className="p-2 rounded-lg text-white bg-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                </form>
                )}
                
            </div>
        </div>
    );
}