import pandas as pd
import json
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import DBSCAN
from pathlib import Path


def extract_coordinates(feature):
    latitude = feature["geometry"]["coordinates"][1]
    longitude = feature["geometry"]["coordinates"][0]
    return pd.Series({"Latitude": latitude, "Longitude": longitude})


def df_to_geojson(dictionary):
    geojson = {
        "type": "FeatureCollection",
        "features": dictionary.to_dict(orient="records"),
    }

    return geojson


def cluster_earthquakes(input_file, output_center_file, output_clustered_file):
    # Load earthquake data into a DataFrame
    with open(input_file, "r") as f:
        geojson_data = json.load(f)

    # Extract features
    features = geojson_data["features"]

    # Create a DataFrame from features
    df = pd.DataFrame(features)

    # Extract Latitude and Longitude columns
    coordinates = df.apply(extract_coordinates, axis=1)

    # Normalize data using Min-Max scaling
    scaler = MinMaxScaler()
    coordinates_scaled = scaler.fit_transform(coordinates)

    # Apply DBSCAN clustering
    dbscan = DBSCAN(eps=0.01, min_samples=5)
    coordinates["cluster"] = dbscan.fit_predict(coordinates_scaled)

    original_df_with_cluster = df.copy()
    original_df_with_cluster["cluster"] = coordinates["cluster"]

    # Aggregate cluster data
    cluster_centers = coordinates.groupby("cluster")[["Latitude", "Longitude"]].mean()
    cluster_counts = coordinates["cluster"].value_counts().reset_index()
    cluster_data = pd.merge(cluster_centers, cluster_counts, on="cluster")

    # Save aggregated data to a new GeoJSON file
    cluster_data.to_csv(output_center_file, index=False)

    with open(output_clustered_file, "w") as f:
        json.dump(df_to_geojson(original_df_with_cluster), f)


if __name__ == "__main__":
    data_path = Path(__file__).parent.parent / "data" / "geojson"
    input_file = Path(data_path) / "earthquakes.geojson"
    clusters_data_file = Path(data_path) / "clustered_earthquakes.csv"
    clustered_earthquakes_file = Path(data_path) / "clustered_earthquakes.geojson"
    cluster_earthquakes(input_file, clusters_data_file, clustered_earthquakes_file)
