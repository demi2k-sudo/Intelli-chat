const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')

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

})

app.post('/register', async (req,res)=>{
    console.log('were in');
    console.log(req.body);
    const {username, password} = req.body;
    try {
        const hashedPassword = bcrypt.hashSymc(password, bcryptSalt)
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


    

app.listen(4040, ()=>{
    console.log('Server is running on port 4040');
});