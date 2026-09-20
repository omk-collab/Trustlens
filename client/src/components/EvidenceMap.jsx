import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitMapToEvidence({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) return;

    if (locations.length === 1) {
      map.setView([locations[0].latitude, locations[0].longitude], 14);
      return;
    }

    const bounds = locations.map((item) => [item.latitude, item.longitude]);

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [locations, map]);

  return null;
}

export default function EvidenceMap({ evidence = [], projectName }) {
  const locations = evidence
    .filter(
      (item) =>
        item.location?.latitude !== null &&
        item.location?.longitude !== null &&
        item.location?.latitude !== undefined &&
        item.location?.longitude !== undefined,
    )
    .map((item) => ({
      ...item,
      latitude: Number(item.location.latitude),
      longitude: Number(item.location.longitude),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.latitude) && Number.isFinite(item.longitude),
    );

  const defaultCenter = [18.5204, 73.8567];

  return (
    <div className="border-b border-slate-800 p-5">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗺️</span>

          <h3 className="text-sm font-bold text-white">
            Evidence Location Map
          </h3>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Geotagged evidence locations for {projectName || "this project"}.
        </p>
      </div>

      {locations.length === 0 ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-5 text-center">
          <div>
            <p className="text-sm font-semibold text-slate-300">
              No geotagged evidence
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Upload evidence with latitude and longitude to display it here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-700">
          <MapContainer
            center={defaultCenter}
            zoom={12}
            scrollWheelZoom={true}
            className="h-[360px] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitMapToEvidence locations={locations} />

            {locations.map((item) => (
              <CircleMarker
                key={item._id}
                center={[item.latitude, item.longitude]}
                radius={10}
                pathOptions={{
                  color: item.verified ? "#10b981" : "#f59e0b",
                  fillColor: item.verified ? "#10b981" : "#f59e0b",
                  fillOpacity: 0.8,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <strong>{item.title || "Evidence"}</strong>

                    <div style={{ marginTop: "6px", fontSize: "12px" }}>
                      📍 {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                    </div>

                    <div style={{ marginTop: "4px", fontSize: "12px" }}>
                      📅{" "}
                      {item.capturedDate
                        ? new Date(item.capturedDate).toLocaleDateString(
                            "en-IN",
                          )
                        : "—"}
                    </div>

                    <div style={{ marginTop: "4px", fontSize: "12px" }}>
                      {item.verified ? "✓ Verified" : "⚠ Pending Verification"}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      )}

      {locations.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Verified evidence
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            Pending verification
          </span>

          <span>
            {locations.length} geotagged location
            {locations.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
