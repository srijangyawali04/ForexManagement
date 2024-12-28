import { DataSource, Transaction } from "typeorm"

import dotenv from "dotenv"
import { User } from "../models/User";
import { Voucher } from "../models/Voucher";
import { Transactions } from "../models/Transaction";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        User,Voucher,Transactions
    ],
    subscribers: [],
    migrations: [],
})
