from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)


# ---------------------------------------------------------
# Load new 6-history model
# ---------------------------------------------------------

model = joblib.load(
    "../ml/price_prediction_pipeline_6_history.pkl"
)

print("6-history price prediction model loaded!")


# ---------------------------------------------------------
# Prediction endpoint
# ---------------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        # -------------------------------------------------
        # Basic input
        # -------------------------------------------------

        product_name = data.get("product_name", "")
        description = data.get("description", "")
        category = data.get("category", "")

        current_price = float(
            data["current_price"]
        )

        price_history = data.get(
            "price_history",
            []
        )


        # -------------------------------------------------
        # Validate price history
        # -------------------------------------------------

        if len(price_history) < 6:

            return jsonify({
                "error": (
                    "At least 6 historical prices "
                    "are required"
                )
            }), 400


        # Use the latest 6 observations
        price_history = [
            float(price)
            for price in price_history[-6:]
        ]


        # -------------------------------------------------
        # Create history fields
        # -------------------------------------------------

        input_data = {

            "text": (
                str(product_name)
                + " "
                + str(description)
            ),

            "category": category,

            "history_1_price":
                price_history[0],

            "history_2_price":
                price_history[1],

            "history_3_price":
                price_history[2],

            "history_4_price":
                price_history[3],

            "history_5_price":
                price_history[4],

            "history_6_price":
                price_history[5],

            "current_price":
                current_price,
        }


        # -------------------------------------------------
        # Create DataFrame
        # -------------------------------------------------

        df = pd.DataFrame([
            input_data
        ])


        history_cols = [

            "history_1_price",
            "history_2_price",
            "history_3_price",
            "history_4_price",
            "history_5_price",
            "history_6_price",
        ]


        history = df[history_cols]


        # -------------------------------------------------
        # Derived features
        # -------------------------------------------------

        df["history_avg_6"] = (
            history.mean(axis=1)
        )

        df["history_min_6"] = (
            history.min(axis=1)
        )

        df["history_max_6"] = (
            history.max(axis=1)
        )

        df["history_std_6"] = (
            history.std(axis=1)
            .fillna(0)
        )


        # Overall price trend
        df["history_trend_pct"] = (

            (
                df["history_6_price"]
                -
                df["history_1_price"]
            )

            /

            df["history_1_price"]
            .replace(0, np.nan)

        ).fillna(0)


        # Current vs latest history
        df["current_change_pct"] = (

            (
                df["current_price"]
                -
                df["history_6_price"]
            )

            /

            df["history_6_price"]
            .replace(0, np.nan)

        ).fillna(0)


        # Current vs 6-history average
        df["current_vs_avg_pct"] = (

            (
                df["current_price"]
                -
                df["history_avg_6"]
            )

            /

            df["history_avg_6"]
            .replace(0, np.nan)

        ).fillna(0)


        # -------------------------------------------------
        # Predict
        # -------------------------------------------------

        predicted_log = model.predict(df)[0]

        predicted_price = np.expm1(
            predicted_log
        )

        predicted_price = max(
            0,
            float(predicted_price)
        )


        # -------------------------------------------------
        # Calculate change
        # -------------------------------------------------

        change_percent = (

            (
                predicted_price
                -
                current_price
            )

            /

            current_price

        ) * 100


        # -------------------------------------------------
        # Recommendation
        # -------------------------------------------------

        if change_percent <= -2:

            recommendation = "WAIT"

            message = (
                "Price is likely to decrease. "
                "You can wait."
            )

        elif change_percent >= 2:

            recommendation = "BUY_NOW"

            message = (
                "Price is likely to increase. "
                "You can buy now."
            )

        else:

            recommendation = "STABLE"

            message = (
                "Price is expected to remain "
                "relatively stable."
            )


        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return jsonify({

            "currentPrice":
                round(
                    current_price,
                    2
                ),

            "predictedPrice":
                round(
                    predicted_price,
                    2
                ),

            "expectedChangePercent":
                round(
                    change_percent,
                    2
                ),

            "recommendation":
                recommendation,

            "message":
                message,

            "historyUsed":
                price_history

        })


    except Exception as e:

        print(
            "Prediction error:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500


# ---------------------------------------------------------
# Start Flask
# ---------------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )