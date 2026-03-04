// backend/routes/predictionRoutes.js

import express from "express";
import { predictEmissionML } from "../ml/predict.js";

const router = express.Router();

router.post("/predict-emission", (req, res) => {
  try {
    const { carbonIntensity, renewablePercentage, pue } = req.body;

    // Validation
    if (
      carbonIntensity === undefined ||
      renewablePercentage === undefined ||
      pue === undefined
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const predictedEmission = predictEmissionML({
      carbonIntensity,
      renewablePercentage,
      pue,
    });

    res.json({
      predictedEmission,
    });
  } catch (error) {
    console.error("ML Prediction Error:", error.message);
    res.status(500).json({
      error: "Failed to predict emission",
    });
  }
});

export default router;
