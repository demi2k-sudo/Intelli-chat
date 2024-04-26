import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import {uniqBy} from "lodash";
import axios from "axios";
import Contact from "./Contact";

export default function Chat(){
    const [ws,setWs] = useState(null);
    const [onlinePeople,setOnlinePeople] = useState({});
    const [selectedUser, setSelectedUser] =useState(null);
    const {username,id} = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const messageRef = useRef();
    const [offPeople, setOffPeople] = useState({});
    const mistral = '65f6b1692604656011d0c978';
    const [requestBody,setRequestBody] = useState({
        "messages": [
                
            ],
            
                "temperature":0.2,
                "max_tokens": -1,
                "stream":false
            
        
    }) ;
    const requestHeaders = new Headers({"Content-Type" : "application/json"});

    // Replace this with the primary/secondary key or AMLToken for the endpoint
    const apiKey = "bLGmzPyHvg2fZMuXhswObDecAGKZRZQK";
    if (!apiKey)
    {
        console.log("A key should be provided to invoke the endpoint");
    }
    // requestHeaders.append("Authorization", "Bearer " + apiKey)

    // This header will force the request to go to a specific deployment.
    // Remove this line to have the request observe the endpoint traffic rules
    // requestHeaders.append("azureml-model-deployment", "mistralai-mistral-7b-instruct-6");

    // const url = "https://demetrius-zweoe.eastus.inference.ml.azure.com/score";
    const url = "http://localhost:5000/chat"
    const urlmistral = "http://localhost:1234/v1/chat/completions"
    useEffect(()=>{
        axios.get('/people').then(res=>{
            const offlinePeopleArr = res.data
                .filter(p=> p.__id!==id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {}
            offlinePeopleArr.forEach(p=>{
                offlinePeople[p._id] = p;
            })
            setOffPeople(offlinePeople);
        })
    },[onlinePeople])

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
    async function suggest(ev){
        ev.preventDefault()
        const conversationChain = (UniqueMessages.length<=10)?[...UniqueMessages]:[...UniqueMessages.slice(-10)]
        const bod = {
            "messages": [
                ],
                
                    "temperature":0.8,
                    "max_tokens": -1,
                    "stream":false
                
            
        }
        const requestHeaders1 = new Headers({"Content-Type" : "application/json"});


        // This header will force the request to go to a specific deployment.
        // Remove this line to have the request observe the endpoint traffic rules
        // requestHeaders1.append("azureml-model-deployment", "mistralai-mistral-7b-instruct-5");
        conversationChain.forEach((x)=>{
            const role = (x.sender===id)?"assistant":"user";
            bod["messages"].push({"role":role,"content":x.text})
        })
        console.log(bod);
        await fetch(url, {
            method: "POST",
            body: JSON.stringify(bod),
            headers: requestHeaders1,
          })
              .then((response) => {
              if (response.ok) {
                  console.log(response)
                  return response.json();
              } else {
                  // Print the headers - they include the request ID and the timestamp, which are useful for debugging the failure
                  console.debug(...response.headers);
                  console.debug(response.body)
                  throw new Error("Request failed with status code" + response.status);
              }
              })
              .then((json) => {
                console.log(json.choices[0].message.content)
                setNewMessageText(json.choices[0].message.content)
                })
              .catch((error) => {
                  console.error(error)
              });
        

    }
    async function sendMessageMistral(ev){
        ev.preventDefault();
        console.log(selectedUser===mistral)
        var messageData2 = {text : newMessageText, sender:id, recipient:selectedUser, _id:Date.now()}
        setMessages((prev) => [...prev, {...messageData2}])
        setNewMessageText('');
        requestBody["messages"].push({"role":"user","content":newMessageText})
        setRequestBody(requestBody)
        console.log(requestBody)
        await fetch(urlmistral, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: requestHeaders,
          })
              .then((response) => {
              if (response.ok) {
                  console.log(response)
                  return response.json();
              } else {
                  // Print the headers - they include the request ID and the timestamp, which are useful for debugging the failure
                  console.debug(...response.headers);
                  console.debug(response.body)
                  throw new Error("Request failed with status code" + response.status);
              }
              })
              .then((json) => {
                console.log(json.choices[0].message.content)
                var dat = json.choices[0].message.content;
                var messageData3 = {text : dat, sender:mistral, recipient:selectedUser, _id:Date.now()}
                setMessages((prev) => [...prev, {...messageData3}])
                requestBody["messages"].push({"role":"assistant","content":dat})
        
                // requestBody["input_data"]["input_string"].push()
                setRequestBody(requestBody)
                console.log(requestBody)
                })
              .catch((error) => {
                  console.error(error)
              });
        
        
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
            <div className="bg-red-100 w-1/3 pl-4 pt-4 flex flex-col">
                <div className="flex-grow">
                    <Logo/>
                    
                    {Object.keys(onlinePeopleMinusUser).map(userId =>(
                        <Contact id={userId} username={onlinePeopleMinusUser[userId]} online={true} onClick={()=>setSelectedUser(userId)} selected={userId===selectedUser}/>
                    ))}
                    {Object.keys(offPeople).map(userId =>(
                        <Contact id={userId} username={offPeople[userId].username} online={false} onClick={()=>setSelectedUser(userId)} selected={userId===selectedUser}/>
                    ))}
                </div>
                {/* <div className="p-2 text-center">
                    <button className="px-2 py-1 text-gray-800 bg-red-200 border rounded-md">Logout</button>
                </div> */}
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
                     (selectedUser===mistral)?
                        (<form className="flex gap-2 " onSubmit={sendMessageMistral}>
                        <input type='text reset'
                            onChange={ev=>setNewMessageText(ev.target.value)} 
                            placeholder="Enter your message here"  
                            className="rounded-lg flex-grow bg-white border p-2"></input>
                            <button type="submit" className="p-2 rounded-lg text-white bg-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                        </form>):
                        (<form className="flex gap-2 " onSubmit={sendMessage}>
                        <input type='text reset' value={newMessageText}
                            onChange={ev=>setNewMessageText(ev.target.value)} 
                            placeholder="Enter your message here"  
                            className="rounded-lg flex-grow bg-white border p-2"></input>
                            <button type="submit" className="p-2 rounded-lg text-white bg-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                            <button type="button" onClick={suggest} className="p-2 rounded-lg text-white bg-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                </svg>
                            </button>
                        </form>)
                    
                    
                )}
                
            </div>
        </div>
    );
}