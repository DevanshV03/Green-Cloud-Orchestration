import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/predict-emission", async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8001/predict",
      req.body,
    );

    res.json(response.data);
  } catch (error) {
    console.error("ML API error:", error.message);
    res.status(500).json({ error: "ML prediction failed" });
  }
});

export default router;
