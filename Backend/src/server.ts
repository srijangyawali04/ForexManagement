import express, { Application } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./initializers/data-source";  // Path to your data source
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import userRoutes from "./routes/userRoutes";  // Import routes (adjust paths as needed)
import authRoutes from "./routes/authRoutes";  // Import routes (adjust paths as needed)

// Initialize dotenv to load environment variables
dotenv.config();

// Create an Express application
const app: Application = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(cookieParser()); // Parse cookies
app.use(compression()); // Enable compression for better performance
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/users", userRoutes); // Define your user routes (adjust as per your needs)
app.use("/api/auth", authRoutes); // Define your auth routes (adjust as per your needs)

// Connect to the database using TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully.");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
