const express=require('express')
const app=express();
const main=require("./database")
const jwt=require("jsonwebtoken")
require('dotenv').config();
const cookieParser = require('cookie-parser')
const cors = require('cors')


const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');

const verifyToken=require('./middleware/verify')
const authorizeRole=require('./middleware/authrole')
const redisClient=require('./config/redis')

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow non-browser requests and same-origin calls.
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
};

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))



app.use('/auth', authRoutes);


app.use('/admin', verifyToken, authorizeRole(['admin']), adminRoutes);


app.use('/student', verifyToken, authorizeRole(['student']), studentRoutes);


const initilizeconnection=async()=>{

   try{
         

        await Promise.all([redisClient.connect(),main()]);
        console.log("DB connected");


        app.listen(process.env.PORT, ()=>{
            console.log("Listening at port 8080");
        })
   }
    catch(err){
        console.log("Error: "+err.message);
    }


}

initilizeconnection();