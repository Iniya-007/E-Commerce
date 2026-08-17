"""
Train the new 6-history price prediction model.

Input:
    price_prediction_6_history.csv

The model receives:
    - product name + description
    - category
    - 6 historical price observations
    - current price
    - derived trend/volatility features

Target:
    target_price_after_2_days

Output:
    price_prediction_pipeline_6_history.pkl
"""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from xgboost import XGBRegressor


BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = BASE_DIR / "price_prediction_6_history.csv"
MODEL_PATH = BASE_DIR / "price_prediction_pipeline_6_history.pkl"


# ---------------------------------------------------------
# 1. Load dataset
# ---------------------------------------------------------

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)
print("Columns:", list(df.columns))


# ---------------------------------------------------------
# 2. Create text + numeric features
# ---------------------------------------------------------

history_cols = [
    "history_1_price",
    "history_2_price",
    "history_3_price",
    "history_4_price",
    "history_5_price",
    "history_6_price",
]

df["text"] = (
    df["product_name"].fillna("").astype(str)
    + " "
    + df["description"].fillna("").astype(str)
)

history = df[history_cols]

# Statistics over the 6 historical observations.
df["history_avg_6"] = history.mean(axis=1)
df["history_min_6"] = history.min(axis=1)
df["history_max_6"] = history.max(axis=1)
df["history_std_6"] = history.std(axis=1).fillna(0)

# Overall direction from oldest to newest history.
df["history_trend_pct"] = (
    (df["history_6_price"] - df["history_1_price"])
    / df["history_1_price"].replace(0, np.nan)
).fillna(0)

# Change from latest historical price to current price.
df["current_change_pct"] = (
    (df["current_price"] - df["history_6_price"])
    / df["history_6_price"].replace(0, np.nan)
).fillna(0)

# Current price relative to the 6-history average.
df["current_vs_avg_pct"] = (
    (df["current_price"] - df["history_avg_6"])
    / df["history_avg_6"].replace(0, np.nan)
).fillna(0)


# ---------------------------------------------------------
# 3. Select features
# ---------------------------------------------------------

numeric_features = (
    history_cols
    + [
        "current_price",
        "history_avg_6",
        "history_min_6",
        "history_max_6",
        "history_std_6",
        "history_trend_pct",
        "current_change_pct",
        "current_vs_avg_pct",
    ]
)

feature_columns = [
    "text",
    "category",
] + numeric_features

X = df[feature_columns]

# Log target makes training less dominated by very expensive products.
y = np.log1p(df["target_price_after_2_days"])


# ---------------------------------------------------------
# 4. Train/test split
# ---------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
)


# ---------------------------------------------------------
# 5. Preprocessing
# ---------------------------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "text",
            TfidfVectorizer(
                max_features=3000,
                ngram_range=(1, 2),
                min_df=2,
            ),
            "text",
        ),
        (
            "category",
            OneHotEncoder(handle_unknown="ignore"),
            ["category"],
        ),
    ],
    remainder="passthrough",
)


# ---------------------------------------------------------
# 6. XGBoost model
# ---------------------------------------------------------

model = XGBRegressor(
    n_estimators=250,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.85,
    colsample_bytree=0.85,
    objective="reg:squarederror",
    eval_metric="rmse",
    tree_method="hist",
    random_state=42,
    n_jobs=-1,
)


pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)


# ---------------------------------------------------------
# 7. Train
# ---------------------------------------------------------

print("\nTraining model...")

pipeline.fit(
    X_train,
    y_train,
)

print("Training completed.")


# ---------------------------------------------------------
# 8. Evaluate
# ---------------------------------------------------------

predicted_log = pipeline.predict(X_test)

predicted_price = np.expm1(predicted_log)
actual_price = np.expm1(y_test)

mae = mean_absolute_error(
    actual_price,
    predicted_price,
)

rmse = np.sqrt(
    mean_squared_error(
        actual_price,
        predicted_price,
    )
)

r2 = r2_score(
    actual_price,
    predicted_price,
)


print("\n==============================")
print("MODEL EVALUATION")
print("==============================")
print(f"MAE : {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R²  : {r2:.4f}")
print("==============================")


# ---------------------------------------------------------
# 9. Save model
# ---------------------------------------------------------

joblib.dump(
    pipeline,
    MODEL_PATH,
)

print("\nModel saved to:")
print(MODEL_PATH)
