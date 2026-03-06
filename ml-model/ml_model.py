from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)

@app.route("/predict-expense", methods=["POST"])
def predict_expense():

    data = request.json
    expenses = data["expenses"]

    # Example: [20000, 22000, 25000, 26000]

    months = np.array(range(len(expenses))).reshape(-1,1)
    values = np.array(expenses)

    model = LinearRegression()
    model.fit(months, values)

    next_month = np.array([[len(expenses)]])
    prediction = model.predict(next_month)[0]

    return jsonify({
        "predicted_expense": round(prediction,2)
    })

if __name__ == "__main__":
    app.run(port=5000)