import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';
import itemRoutes from './Routes/itemRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import userMail from './Routes/userMail.js';


const app = express();
dotenv.config();

//MiddleWare
app.use(express.json());
app.use(cors());

app.use('/', authRoutes);
app.use('/', itemRoutes);
app.use('/', userMail);
app.use('/getUser',authRoutes, userRoutes);

app.listen(process.env.PORT,'0.0.0.0', ()=>{
    console.log(`Server is running at ${process.env.PORT}`);
});