import sys
import joblib
import numpy as np

"""
Inputs received from Node backend (in this order):
1. carbon_intensity (gCO₂/kWh)
2. renewable_percentage (%)
3. pue
4. workload (kWh)

Output:
- predicted emission (gCO₂)
"""

def main():
    try:
        # Load trained Random Forest model
        model = joblib.load("ml/rf_emission_model.pkl")

        # Read CLI arguments
        carbon_intensity = float(sys.argv[1])
        renewable_percentage = float(sys.argv[2])
        pue = float(sys.argv[3])
        workload = float(sys.argv[4])

        # Prepare input exactly as training data
        X = np.array([[
            carbon_intensity,
            renewable_percentage,
            pue,
            workload
        ]])

        # Predict
        prediction = model.predict(X)[0]

        # Print result for Node.js to capture
        print(float(prediction))

    except Exception as e:
        print("ERROR:", e)


if __name__ == "__main__":
    main()