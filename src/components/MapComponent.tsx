import React from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import locations from "../data/locations.json";
import { LatLngExpression } from "leaflet";

function MapComponent() {
    const sortedLocations = [...locations].sort((a, b) => a.id - b.id);
    console.log("Sorted Locations:", sortedLocations);

    // Extract polyline positions from the sorted locations
    const polylineSegments: LatLngExpression[][] = sortedLocations.map((currentLocation, index, array) => {
        if (index < array.length - 1) {
            const nextLocation = array[index + 1];
            return [
                [currentLocation.latitude, currentLocation.longitude],
                [nextLocation.latitude, nextLocation.longitude],
            ];
        }
        return null; // Return null for the last location
    }).filter(segment => segment !== null);

    console.log(polylineSegments);
    return (
        <MapContainer
            center={[42.3427532432473, -71.09707496510488]}
            zoom={20}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Render markers */}
            {locations.map((location) => (
                <Marker key={location.id} position={[location.latitude, location.longitude] as LatLngExpression}>
                    <Popup closeOnClick={false} interactive>
                        <strong>{location.title}</strong>
                        <br />
                        {location.description}
                        <div style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "10px",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                        }}>
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
                                        flexShrink: 0, // Prevent images from shrinking or growing
                                    }}
                                />
                            ))}
                        </div>
                    </Popup>
                </Marker>
            ))}
            {polylineSegments.map((segment, index) => (
                <Polyline key={index} positions={segment} color="#b34c62" weight={4} opacity={0.7} dashArray="8, 12" />
            ))}
        </MapContainer>
    );
}

export default MapComponent;
