const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const ws = require('ws');
const MessageModel = require('./models/message');

dotenv.config();
const bcryptSalt = bcrypt.genSaltSync(10);
try {
    mongoose.connect('mongodb://localhost:27017/chat-app');
} catch (error) {
    if (error) console.log(error);
}

const app = express();


app.use(express.json());
app.use(cookieParser())
app.use(cors(
    {
        credentials:true,
        origin:'http://localhost:3000'
    }
));


async function getUserDataFromRequest(req){
    return new Promise((resolve,reject)=>{
        const token = req.cookies?.token;
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, {}, (err,userData)=>{
                if (err) throw error;
                resolve(userData);                
            })
        }
        else{
            reject('no token');
        }
    })    
}

app.get('/profile', (req,res)=>{
    const token = req.cookies?.token;

    if(token){
        
        jwt.verify(token, process.env.JWT_SECRET, {}, (err,userData)=>{
            if (err) {};
            res.json(userData);
        })
    }
    else{
        res.status(320).json('no token');
    }
    
});

app.get('/test',(req,res)=>{
    res.json('test ok')
})

app.post('/login', async (req,res) => {
    const {username,password} =req.body;
    const user = await UserModel.findOne({username:username})
    if(user){
        const passOk = bcrypt.compareSync(password, user.password)
        if (passOk){
            jwt.sign({userId:user._id,username},process.env.JWT_SECRET, {},(err,token)=>{
                if(err) console.log(err);
                else
                res.cookie('token',token,{sameSite:'none',secure:true}).status(201).json({
                    id:user._id,
                    
                });
            });
        }
    }

})

app.get('/messages/:userId', async(req,res)=>{
    const {userId} = req.params;
    const userData = await getUserDataFromRequest(req);
    const reqUserId = userData.userId;
    const msgs = await MessageModel.find({
        sender:{$in:[userId,reqUserId]}, 
        recipient:{$in:[userId,reqUserId]},
    }).sort({createdAt:1})
    res.json(msgs);
})

app.post('/register', async (req,res)=>{
    console.log('were in');
    console.log(req.body);
    const {username, password} = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt)
        const createdUser =  await UserModel.create({username, 
            password:hashedPassword});
     
        jwt.sign({userId:createdUser._id,username},process.env.JWT_SECRET, {},(err,token)=>{
            if(err) console.log(err);
            else
            res.cookie('token',token,{sameSite:'none',secure:true}).status(201).json({
                id:createdUser._id,
                
            });
        });
    } catch (err) {
        if (err) console.log(err);
    }
});


    

const server = app.listen(4040, ()=>{
    console.log('Server is running on port 4040');
});

const wss = new ws.WebSocketServer({server});

wss.on('connection',(connection,req)=>{
    const cookies = req.headers.cookie;
    if(cookies){
        const tokenCookieString = cookies.split(';').find(str=>str.startsWith('token='))
        if(tokenCookieString){
            const token = tokenCookieString.split('=')[1];
            if(token){
                jwt.verify(token, process.env.JWT_SECRET, {}, (err,userData)=>{
                    if (err) console.log(err);
                    else {
                        const {userId, username} = userData;
                        connection.userId = userId;
                        connection.username = username;
                    }
                });
            }
        }
    }
    //online status!
    [...wss.clients].forEach(client=>{
        client.send(JSON.stringify({
            online : [...wss.clients].map(c=>({
                userId:c.userId, username:c.username
            }))
        }));
    });

    connection.on('message', async(message)=>{
        messageData = JSON.parse(message.toString());
        const {recipient, text} = messageData;
        if(recipient && text) {
            const MessageDoc = await MessageModel.create({sender:connection.userId,recipient,text});
            [...wss.clients]
            .filter(c=>c.userId===recipient)
            .forEach(c => c.send(JSON.stringify({text, sender:connection.userId, recipient, _id:MessageDoc._id})));
        }
    })
});

