import express from "express";
import { getAllCurrencies, fetchForexRates } from "../controllers/exchangeController";

const router = express.Router();

// Route to fetch all currencies with their rates
router.get("/", getAllCurrencies);


// Route to manually trigger forex rates fetch
router.post("/trigger-fetch", async (req, res) => {
    try {
      await fetchForexRates();  
      res.status(200).json({ message: "Forex rates fetched successfully!" });
    } catch (error) {
      console.error("Error fetching forex rates:", error.message);
      res.status(500).json({ message: "Error fetching forex rates" });
    }
  });

export default router;
