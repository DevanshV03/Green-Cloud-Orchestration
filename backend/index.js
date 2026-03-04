import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import carbonFootprintRoutes from "./routes/carbonFootprintRoutes.js";
import preferencesRoutes from "./routes/preferencesRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import mlPredictionRoutes from "./routes/mlPredictionRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: Allow all origins
// The recommendation API and SDK are public-facing — any external app needs to call them
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", carbonFootprintRoutes);
app.use("/api", preferencesRoutes);

// ML routes
app.use("/api/ml", mlRoutes);
app.use("/api", predictionRoutes);
app.use("/api", mlPredictionRoutes);

// Serve the embeddable SDK as a static file
// Access at: http://localhost:3000/sdk/green-cloud.js
app.use("/sdk", express.static("sdk"));


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/api`);
});
