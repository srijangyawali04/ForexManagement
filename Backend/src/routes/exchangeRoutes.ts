import express from "express";
import { getAllCurrencies } from "../controllers/exchangeController";

const router = express.Router();

// Route to fetch all currencies with their rates
router.get("/", getAllCurrencies);

export default router;
