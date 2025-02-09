import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import "reflect-metadata";
import './schedule_task/scheduleTask';
import { AppDataSource } from './initializers/data-source';
import UserRouter from './routes/userRoutes';
import VoucherRouter from './routes/voucherRoutes';
import TransactionRouter from './routes/transactionRoutes';
import exchangeRoutes from './routes/exchangeRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from "dotenv";

dotenv.config();

// Configure CORS
const corsOptions = {
    origin: "http://localhost:5173" ,  
    methods: ["GET", "POST", "PUT", "PATCH"], 
    credentials: true, 
};

const port: number = 5000;
const app = express();

app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use('/api/user', UserRouter);
app.use('/api/voucher', VoucherRouter);
app.use('/api/transaction', TransactionRouter);
app.use("/api/exchange-rates", exchangeRoutes);
app.use('/api/auth', authRoutes);

// Initialize database & start the server
AppDataSource.initialize()
    .then(() => {
        // Make sure the app listens on all interfaces (0.0.0.0) to be accessible from any IP
        app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => console.log(err));
