import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import "reflect-metadata"
import './schedule_task/scheduleTask';
import { AppDataSource } from './initializers/data-source'
import UserRouter from './routes/userRoutes'
import VoucherRouter from './routes/voucherRoutes';
// import TransactionRouter from './routes/transactionRoutes'
import exchangeRoutes from './routes/exchangeRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from "dotenv";

// Initialize dotenv to load environment variables
dotenv.config();

// Configure CORS
const corsOptions = {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT","PATCH" , "DELETE"], 
    credentials: true, 
};

const port: number = 5000
const app = express()
app.use(cors(corsOptions));
app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Set up routes
app.use('/api/user', UserRouter)
app.use('/api/voucher', VoucherRouter);
// app.use('/api/transaction', TransactionRouter)
app.use("/api/exchange-rates", exchangeRoutes);
app.use('/api/auth', authRoutes);

// Initialize database & start the server
AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => { console.log(`Server is running on port:${port}`); });
    })
    .catch((err) => console.log(err))
