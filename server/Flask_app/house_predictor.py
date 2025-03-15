import xgboost as xgb
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import logging
from sklearn.metrics import mean_squared_error

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load dataset once when the server starts
file_path = 'Datasets/Updated_Property_Data_Modified.csv'
property_data = pd.read_csv(file_path)

# Clean column names
property_data.columns = property_data.columns.str.strip().str.lower()

# Feature engineering function with multiple lag features
def create_features(data):
    years = np.arange(2015, 2015 + len(data)).reshape(-1, 1)

    # Create multiple lag features (price from 1, 2, 3 years ago)
    lag_price_1 = np.roll(data, shift=1).reshape(-1, 1)
    lag_price_2 = np.roll(data, shift=2).reshape(-1, 1)
    lag_price_3 = np.roll(data, shift=3).reshape(-1, 1)

    # Rolling average (2-year moving average)
    rolling_avg = pd.Series(data).rolling(window=2).mean().ffill().values.reshape(-1, 1)

    # Percentage change (year-over-year price change)
    pct_change = pd.Series(data).pct_change().fillna(0).values.reshape(-1, 1)

    # Combine all features
    X = np.hstack([years, lag_price_1, lag_price_2, lag_price_3, rolling_avg, pct_change])
    return X

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    user_city = data.get('city')
    user_location = data.get('location')
    user_area_marla = data.get('marla')

    if not user_location or not user_area_marla:
        return jsonify({'error': 'Location and Marla parameters are required.'}), 400

    try:
        user_area_marla = float(user_area_marla)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid value for marla.'}), 400

    # Log the request parameters for debugging
    app.logger.debug(f"Request Data: city={user_city}, location={user_location}, marla={user_area_marla}")

    # Filter the data based on the user inputs (city and society)
    filtered_data = property_data[
        (property_data['city'].str.lower() == user_city.lower()) &
        (property_data['location'].str.lower() == user_location.lower()) &
        (property_data['area_marla'] == user_area_marla)
    ]

    # Check if the filtered data is empty
    if not filtered_data.empty:
        # Ensure only price columns with valid years up to 2023 are used
        price_columns = [
            col for col in filtered_data.columns 
            if col.startswith('price_') and col.replace('price_', '').isdigit() and int(col.replace('price_', '')) <= 2023
        ]

        prices = filtered_data[price_columns].values.flatten()

        # Create features for the XGBoost model
        X = create_features(prices)
        y = prices
        
        # Chronological split (train on first 80% of data, test on last 20%)
        train_size = int(len(X) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]

        # Initialize and train the XGBoost model
        model = xgb.XGBRegressor(
            objective='reg:squarederror', 
            n_estimators=1000, 
            learning_rate=0.01, 
            max_depth=6, 
            subsample=0.8, 
            colsample_bytree=0.8,
            early_stopping_rounds=10
        )
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

        # Predict on the test set and log performance
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        app.logger.debug(f"Test MSE: {mse}")

        # Forecast only for the year 2024
        future_year = np.array([[2024]])
        future_lag_price_1 = np.array([[prices[-1]]])  # Lag price from 2023
        future_lag_price_2 = np.array([[prices[-2]]])  # Lag price from 2022
        future_lag_price_3 = np.array([[prices[-3]]])  # Lag price from 2021
        future_rolling_avg = np.array([[pd.Series(prices).rolling(window=2).mean().iloc[-1]]])  # Rolling avg of last 2 years
        future_pct_change = np.array([[pd.Series(prices).pct_change().fillna(0).iloc[-1]]])  # Percentage change from 2022 to 2023

        # Combine future features
        future_X = np.hstack([future_year, future_lag_price_1, future_lag_price_2, future_lag_price_3, future_rolling_avg, future_pct_change])

        # Predict the price for 2024
        future_price = model.predict(future_X)[0]

        # Prepare data for plotting (Limit to 2024)
        historical_data = pd.DataFrame({'Date': np.arange(2015, 2015 + len(prices)), 'Price': prices})

        # Ensure only data up to 2024 is included (no duplicate 2024)
        forecast_data = pd.DataFrame({'Date': [2024], 'Price': [future_price]})
        combined_data = pd.concat([historical_data, forecast_data], ignore_index=True)

        # Filter out any years beyond 2024
        combined_data = combined_data[combined_data['Date'] <= 2024]

        # Log the combined data
        app.logger.debug(f"Combined data for plotting:\n{combined_data}")

        # Log feature importance
        importance = model.get_booster().get_score(importance_type='weight')
        app.logger.debug("Feature importance:")
        app.logger.debug(importance)

        # Extract the predicted price for 2024
        predicted_price = future_price

        # Prepare the response
        response = {
            'prediction': f"{predicted_price:,.2f}",
            'plotData': combined_data.to_dict(orient='records'),  # Only return data till 2024
        }

        # Return the JSON response
        return jsonify(response)
    else:
        app.logger.warning('No data available for the specified filters.')
        return jsonify({'error': 'No data available for the specified filters.'}), 404

if __name__ == '__main__':
    app.run(port=5001)
