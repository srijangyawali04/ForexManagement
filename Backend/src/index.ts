import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import "reflect-metadata"
import './schedule_task/scheduleTask';
import { AppDataSource } from './initializers/data-source'
import UserRouter from './routes/userRoutes'
import VoucherRouter from './routes/voucherRoutes';
import TransactionRouter from './routes/transactionRoutes'
import exchangeRoutes from './routes/exchangeRoutes';
import authRoutes from './routes/authRoutes';

// Configure CORS
// const corsOptions = {
//     origin: "http://52.72.129.0:5173", // Allow requests from this origin
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
//     credentials: true, // Allow cookies or other credentials to be sent
// };

// setting up server
const port: number = 5000
const app = express()
app.use(cors());
app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/user',UserRouter)
app.use('/api/voucher', VoucherRouter);
app.use('/api/transaction', TransactionRouter)
app.use("/api/exchange-rates", exchangeRoutes);
app.use('/api/auth', authRoutes);

// initiatlizing db & starting server
AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => { console.log(`Server is running on port:${port}`); });
    })
    .catch((err) => console.log(err))
