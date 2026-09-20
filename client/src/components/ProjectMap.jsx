import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function FitProjects({ projects }) {
  const map = useMap();

  useEffect(() => {
    if (!projects.length) return;

    const validProjects = projects.filter(
      (project) =>
        Number.isFinite(Number(project.latitude)) &&
        Number.isFinite(Number(project.longitude)),
    );

    if (validProjects.length === 0) {
      map.setView([19.0, 74.0], 7);
      return;
    }

    if (validProjects.length === 1) {
      map.setView(
        [Number(validProjects[0].latitude), Number(validProjects[0].longitude)],
        12,
      );
      return;
    }

    const bounds = validProjects.map((project) => [
      Number(project.latitude),
      Number(project.longitude),
    ]);

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [projects, map]);

  return null;
}

function getRiskColor(level) {
  switch (level) {
    case "CRITICAL":
      return "#ef4444";

    case "HIGH":
      return "#f97316";

    case "MEDIUM":
      return "#eab308";

    default:
      return "#22c55e";
  }
}

export default function ProjectMap({ projects = [] }) {
  const [projectsWithRisk, setProjectsWithRisk] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadRiskData() {
      try {
        const results = await Promise.all(
          projects.map(async (project) => {
            try {
              const response = await fetch(
                `${API}/api/risk/financial/${project._id}`,
              );

              const result = await response.json();

              return {
                ...project,
                risk: {
                  score: Number(result?.data?.riskScore ?? 0),
                  level: result?.data?.riskLevel || "LOW",
                  factors: result?.data?.factors || [],
                },
              };
            } catch (error) {
              console.error(`Risk fetch failed for ${project.name}`, error);

              return {
                ...project,
                risk: {
                  score: 0,
                  level: "LOW",
                  factors: [],
                },
              };
            }
          }),
        );

        if (!cancelled) {
          setProjectsWithRisk(results);
        }
      } catch (error) {
        console.error("Failed to load project risk data:", error);

        if (!cancelled) {
          setProjectsWithRisk(projects);
        }
      }
    }

    if (projects.length > 0) {
      loadRiskData();
    } else {
      setProjectsWithRisk([]);
    }

    return () => {
      cancelled = true;
    };
  }, [projects]);

  const mappedProjects = projectsWithRisk
    .map((project) => {
      const location = (project.location || "").toLowerCase();

      let latitude = null;
      let longitude = null;

      if (location.includes("pune")) {
        latitude = 18.5204;
        longitude = 73.8567;
      } else if (location.includes("nashik")) {
        latitude = 19.9975;
        longitude = 73.7898;
      } else if (
        location.includes("aurangabad") ||
        location.includes("chhatrapati sambhajinagar")
      ) {
        latitude = 19.8762;
        longitude = 75.3433;
      }

      return {
        ...project,
        latitude,
        longitude,
      };
    })
    .filter(
      (project) => project.latitude !== null && project.longitude !== null,
    );

  return (
    <section className="mt-12">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗺️</span>

          <h2 className="font-[Plus_Jakarta_Sans] text-xl font-bold">
            Project Monitoring Map
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Geographic overview of projects currently tracked by TrustLens.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {mappedProjects.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center text-sm text-slate-500">
            No project locations available.
          </div>
        ) : (
          <MapContainer
            center={[19.0, 74.0]}
            zoom={7}
            scrollWheelZoom={true}
            className="h-[420px] w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitProjects projects={mappedProjects} />

            {mappedProjects.map((project) => {
              const riskLevel = project.risk?.level || "LOW";
              const riskScore = Number(project.risk?.score ?? 0);

              return (
                <CircleMarker
                  key={project._id}
                  center={[project.latitude, project.longitude]}
                  radius={11}
                  pathOptions={{
                    color: getRiskColor(riskLevel),
                    fillColor: getRiskColor(riskLevel),
                    fillOpacity: 0.8,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="min-w-[210px]">
                      <strong>{project.name}</strong>

                      <div
                        style={{
                          marginTop: "7px",
                          fontSize: "12px",
                        }}
                      >
                        📍 {project.location}
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "12px",
                        }}
                      >
                        📊 Progress: {project.progress?.physicalProgress || 0}%
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        ⚠ Risk: {riskScore}/100
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Risk Level: {riskLevel}
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "12px",
                        }}
                      >
                        Status: {project.progress?.status || "Not Started"}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          (window.location.href = `/projects/${project._id}`)
                        }
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          border: "none",
                          borderRadius: "8px",
                          padding: "7px 10px",
                          background: "#2563eb",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        View Project
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Low
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          Medium
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          High
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Critical
        </span>

        <span>{mappedProjects.length} projects mapped</span>
      </div>
    </section>
  );
}
