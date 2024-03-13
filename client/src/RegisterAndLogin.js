import axios from 'axios';
import { useContext, useState } from 'react'
import { UserContext } from './UserContext';
export default function RegisterAndLogin(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin,setIsLogin] = useState("register")


    const{setUsername:setLoggedInUsername,setId}= useContext(UserContext);


    async function handleSubmit(ev){
        ev.preventDefault();
        const url = isLogin === 'register'?'/register':'/login';
        const {data} = await axios.post(url, {username,password});
        setLoggedInUsername(username);
        setId(data._id);
    }

    

    return(
        <div className="bg-red-50 h-screen flex items-center">
            <form className="w-64 mx-auto" onSubmit={handleSubmit}>
                <input type="text" placeholder="username" value = {username} onChange={(e)=>setUsername(e.target.value)} className="block border w-full rounded-sm p-1 m-2"/>
                <input type="password" placeholder="password" value = {password} onChange={(e)=>setPassword(e.target.value)} className="block border w-full rounded-sm p-1 m-2"/>
                <button className="w-full bg-red-500 rounded-md m-2 text-white block p-1">{isLogin==='register'?'Register':'Login'}</button>
            {isLogin==='register'&&
                <div className='text-center mt-2'>
                    Already a member? <button className='text-red-500' onClick={()=> setIsLogin('login')}>Login Here</button>
                </div>}
            {isLogin==='login'&&
                <div className='text-center mt-2'>
                    Don't have an account? <button className='text-red-500' onClick={()=> setIsLogin('register')}>Login Here</button>
                </div>}
            </form>
        </div>
    )
}