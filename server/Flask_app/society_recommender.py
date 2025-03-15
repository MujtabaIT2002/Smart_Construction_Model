from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.cluster import KMeans

# Create the Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load the dataset once when the server starts
file_path = 'Datasets/Updated_Property_Data_Modified.csv'
property_data = pd.read_csv(file_path)

# Clean column names
property_data.columns = property_data.columns.str.strip().str.lower()

# Function to convert price estimate into price bin
def get_price_bin(price_estimate):
    if price_estimate >= 140000000:  # 14 crore
        return 'very high'
    elif price_estimate >= 70000000:  # 7 crore
        return 'high'
    elif price_estimate >= 50000000:  # 5 crore
        return 'medium'
    elif price_estimate >= 35000000:  # 3.5 crore
        return 'low'
    else:
        return 'very low'

# Perform K-means clustering
def perform_clustering(data, num_clusters=4):
    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    data['cluster'] = kmeans.fit_predict(data[['price_2023', 'area_marla']])
    return kmeans

# Perform KNN to recommend similar societies
def perform_knn(data, user_input, k=4):  # Updated to return 4 neighbors
    knn_model = NearestNeighbors(n_neighbors=k)
    knn_model.fit(data[['price_2023', 'area_marla']])
    distances, indices = knn_model.kneighbors([user_input])
    recommendations = data.iloc[indices[0]]
    return recommendations

# Route for recommending societies
@app.route('/recommend', methods=['POST'])
def recommend_societies():
    data = request.get_json()

    user_city = data.get('city')
    user_price_bin = data.get('price_bin')
    user_marla = float(data.get('marla'))

    # Filter the dataset based on city, price bin, and marla
    filtered_data = property_data[
        (property_data['city'].str.lower() == user_city.lower()) &
        (property_data['price_bin'].str.lower() == user_price_bin) &
        (property_data['area_marla'] == user_marla)
    ]

    # If no data is found, return a 404 error
    if filtered_data.empty:
        return jsonify({'error': 'No societies found for the given filters.'}), 404

    # Perform K-means clustering
    perform_clustering(filtered_data)

    # Use KNN to recommend societies similar to the user's input
    user_input = [filtered_data['price_2023'].mean(), user_marla]
    recommendations = perform_knn(filtered_data, user_input)

    # Prepare recommendations with latitude and longitude for the response
    recommendation_list = recommendations[['city', 'location', 'price_2023', 'area_marla', 'price_bin', 'cluster', 'latitude', 'longitude']].to_dict(orient='records')

    # Return recommendations in the response
    return jsonify({
        'recommendations': recommendation_list
    })

if __name__ == '__main__':
    app.run(port=5002)
