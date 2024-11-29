import { useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import locations from "../data/locations.json";
import L, { LatLngExpression } from "leaflet";

// Set up Leaflet marker icons with dynamic paths
L.Icon.Default.mergeOptions({
    iconRetinaUrl: `${import.meta.env.BASE_URL}images/leaflet/marker-icon-2x.png`,
    iconUrl: `${import.meta.env.BASE_URL}images/leaflet/marker-icon.png`,
    shadowUrl: `${import.meta.env.BASE_URL}images/leaflet/marker-shadow.png`,
});

function MapComponent() {
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current location index
    const basePath = import.meta.env.BASE_URL;

    const processedLocations = [...locations]
        .map((location) => ({
            ...location,
            images: location.images.map((image) => `${basePath}${image}`),
        }))
        .sort((a, b) => a.id - b.id); // Sort after processing

    const polylineSegments: LatLngExpression[][] = processedLocations
        .map((currentLocation, index, array) => {
            if (index < array.length - 1) {
                const nextLocation = array[index + 1];
                return [
                    [currentLocation.latitude, currentLocation.longitude] as LatLngExpression,
                    [nextLocation.latitude, nextLocation.longitude] as LatLngExpression,
                ];
            }
            return null;
        })
        .filter((segment): segment is LatLngExpression[] => segment !== null);

    // Navigate to a specific location
    function FlyToLocation({ location }: { location: LatLngExpression }) {
        const map = useMap();
        map.flyTo(location, 15); // Adjust zoom level as needed
        return null;
    }

    // Event handlers for navigation
    const goToNextLocation = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % processedLocations.length);
    };

    const goToPreviousLocation = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? processedLocations.length - 1 : prevIndex - 1
        );
    };

    const currentLocation = processedLocations[currentIndex];

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    display: "flex",
                    gap: "10px",
                }}
            >
                <button
                    onClick={goToPreviousLocation}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#6691ec",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4d7fd8")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4d7fd8")}
                >
                    ← Previous
                </button>
                <button
                    onClick={goToNextLocation}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#6691ec",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4d7fd8")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4d7fd8")}
                >
                    Next →
                </button>
            </div>
            <MapContainer
                center={[currentLocation.latitude, currentLocation.longitude]}
                zoom={15}
                scrollWheelZoom={true}
                style={{height: "100vh", width: "100%"}}
            >
                <FlyToLocation
                    location={[currentLocation.latitude, currentLocation.longitude] as LatLngExpression}
                />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Render markers */}
                {processedLocations.map((location) => (
                    <Marker key={location.id} position={[location.latitude, location.longitude] as LatLngExpression}>
                        <Popup closeOnClick={false} interactive>
                            <strong>{location.title}</strong>
                            <br/>
                            {location.description}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "10px",
                                    overflowX: "auto",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {location.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${location.title} - ${index + 1}`}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            borderRadius: "5px",
                                            marginBottom: "10px",
                                            flexShrink: 0,
                                        }}
                                    />
                                ))}
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {/* Render polyline segments */}
                {polylineSegments.map((segment, index) => (
                    <Polyline key={index} positions={segment} color="#b34c62" weight={4} opacity={0.7} dashArray="8, 12" />
                ))}
            </MapContainer>
        </>
    );
}

export default MapComponent;
