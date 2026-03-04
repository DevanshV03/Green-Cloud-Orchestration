import express from "express";
import { spawn } from "child_process";

const router = express.Router();

/*
  POST /api/ml/predict-emission

  Input (from frontend slider):
  {
    carbonIntensity: number,
    renewablePercentage: number,
    pue: number,
    workload: number
  }

  Output:
  {
    predictedEmission: number
  }
*/

router.post("/predict-emission", async (req, res) => {
  try {
    const { carbonIntensity, renewablePercentage, pue, workload } = req.body;

    // Basic validation
    if (
      carbonIntensity === undefined ||
      renewablePercentage === undefined ||
      pue === undefined ||
      workload === undefined
    ) {
      return res.status(400).json({
        error: "Missing required input features",
      });
    }

    /*
      We call a Python script that:
      - loads the trained Random Forest model
      - predicts emission
    */

    const pythonProcess = spawn("python", [
      "ml/predict.py",
      carbonIntensity,
      renewablePercentage,
      pue,
      workload,
    ]);

    let output = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("ML Error:", data.toString());
    });

    pythonProcess.on("close", () => {
      const predictedEmission = parseFloat(output);

      if (isNaN(predictedEmission)) {
        return res.status(500).json({
          error: "Failed to generate ML prediction",
        });
      }

      return res.status(200).json({
        predictedEmission,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ML prediction failed" });
  }
});

export default router;
