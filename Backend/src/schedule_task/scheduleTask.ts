import cron from "node-cron";
import moment from "moment-timezone";
import { fetchForexRates } from "../controllers/exchangeController";

const scheduleTask = () => {
  const nowNepalTime = moment.tz("Asia/Kathmandu").format("YYYY-MM-DD HH:mm:ss");
  console.log(`Current Nepal Time: ${nowNepalTime}`);

  // Schedule to run at {time} Nepal Time daily
  cron.schedule("30 18 * * *", async () => {
    console.log(`Fetching forex rates at: ${nowNepalTime}`);
    await fetchForexRates();
  });
};

scheduleTask();
