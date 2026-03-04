from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Load trained model
model = joblib.load("emission_model.joblib")

app = FastAPI()

class EmissionInput(BaseModel):
    carbon_intensity: float
    renewable_percentage: float
    pue: float
    workload: float

@app.post("/predict")
def predict_emission(data: EmissionInput):
    X = np.array([[
        data.carbon_intensity,
        data.renewable_percentage,
        data.pue,
        data.workload
    ]])

    prediction = model.predict(X)[0]

    return {
        "predictedEmission": round(float(prediction), 2)
    }