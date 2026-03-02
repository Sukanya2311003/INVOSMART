from flask import Flask, request, jsonify
import numpy as np
from sklearn.ensemble import IsolationForest

app = Flask(__name__)

# Dummy training data
X_train = np.array([
    [5000, 0, 2, 5, 0],
    [20000, 3, 15, 1, 1],
    [8000, 1, 5, 3, 0],
    [30000, 4, 20, 1, 1],
    [15000, 2, 10, 2, 0],
    [4000, 0, 1, 6, 0]
])

model = IsolationForest(contamination=0.3)
model.fit(X_train)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = np.array([[
        data["amount"],
        data["late_count"],
        data["avg_delay"],
        data["frequency"],
        data["new_client"]
    ]])

    prediction = model.predict(features)

    if prediction[0] == -1:
        risk_score = 0.9
        risk_level = "High"
    else:
        risk_score = 0.2
        risk_level = "Low"

    return jsonify({
        "risk_score": risk_score,
        "risk_level": risk_level
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
