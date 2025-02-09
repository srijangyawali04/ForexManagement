import express from "express";
import {fetchAllTransactions, fetchSpecificTransactions} from "../controllers/transactionController";

const router = express.Router();


//fetch all transaction
router.get("/",fetchAllTransactions);

// Define the route for fetching specific transactions
router.get('/report-generation', fetchSpecificTransactions);

export default router;
