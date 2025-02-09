// import cron from "node-cron";
// import moment from "moment-timezone";
// import { fetchForexRates } from "../controllers/exchangeController";

// const scheduleTask = () => {
//   const nowNepalTime = moment.tz("Asia/Kathmandu").format("YYYY-MM-DD HH:mm:ss");
//   console.log(`Current Nepal Time: ${nowNepalTime}`);

//   // Schedule to run at 18:30 Nepal Time daily
//   cron.schedule("20 9 * * *", async () => {
//     console.log(`Fetching forex rates at: ${nowNepalTime}`);
//     await fetchForexRates();
//   });
// };

// scheduleTask();

import cron from "node-cron";
import moment from "moment-timezone";
import { fetchForexRates } from "../controllers/exchangeController";

const scheduleTask = () => {
  // Log the server's local time in UTC
  const nowUtcTime = moment().tz("UTC").format("YYYY-MM-DD HH:mm:ss"); // Get the current UTC time
  console.log(`Server's local time (UTC): ${nowUtcTime}`); // Display the UTC time

  // Schedule to run at 18:30 UTC (adjust this time as needed)
  cron.schedule("36 3 * * *", async () => {
    console.log(`Fetching forex rates at the server's local time (UTC).`);
    await fetchForexRates();
  });
};

scheduleTask();
