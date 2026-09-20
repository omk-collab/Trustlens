import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CircleDollarSign,
  MapPin,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function formatCrore(amount = 0) {
  return `₹${(amount / 10000000).toFixed(2)} Cr`;
}

function getRiskStyles(level) {
  switch (level) {
    case "CRITICAL":
      return {
        badge: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        dot: "bg-red-500",
      };

    case "HIGH":
      return {
        badge:
          "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
        dot: "bg-orange-500",
      };

    case "MEDIUM":
      return {
        badge:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
        dot: "bg-yellow-500",
      };

    default:
      return {
        badge:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        dot: "bg-emerald-500",
      };
  }
}

function ProjectCard({ project, onEdit, onDelete }) {
  const [risk, setRisk] = useState({
    score: 0,
    level: "LOW",
  });

  const progress = project?.progress?.physicalProgress ?? 0;
  const status = project?.progress?.status ?? "Not Started";

  const statusStyles = {
    "Not Started":
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",

    "In Progress":
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    Completed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  const sanctioned = project?.financial?.sanctionedAmount || 0;
  const spent = project?.financial?.spentAmount || 0;

  const utilization = sanctioned ? Math.round((spent / sanctioned) * 100) : 0;

  useEffect(() => {
    let cancelled = false;

    async function loadRisk() {
      try {
        const response = await fetch(
          `${API}/api/risk/financial/${project._id}`,
        );

        const result = await response.json();

        if (!cancelled && result?.success) {
          setRisk({
            score: Number(result?.data?.riskScore ?? 0),
            level: result?.data?.riskLevel || "LOW",
          });
        }
      } catch (error) {
        console.error(`Failed to load risk for ${project?.name}:`, error);
      }
    }

    if (project?._id) {
      loadRisk();
    }

    return () => {
      cancelled = true;
    };
  }, [project?._id]);

  const riskStyles = getRiskStyles(risk.level);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* TOP ACCENT */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-80" />

      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Building2 size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {project?.category || "Project"}
            </p>

            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              Project ID: {project?._id?.slice(-6)}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
            statusStyles[status] || statusStyles["Not Started"]
          }`}
        >
          {status}
        </span>
      </div>

      {/* TITLE */}
      <h3 className="text-xl font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        {project?.name}
      </h3>

      {/* LOCATION */}
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <MapPin size={16} className="shrink-0" />
        <span>{project?.location || "Location unavailable"}</span>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-4 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-600 dark:text-slate-400">
        {project?.description ||
          "Project information and monitoring details are available here."}
      </p>

      {/* PROGRESS */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Physical Progress
          </span>

          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
            }}
          />
        </div>
      </div>

      {/* FINANCIAL */}
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <CircleDollarSign size={14} />
            Sanctioned
          </div>

          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {formatCrore(sanctioned)}
          </p>
        </div>

        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Wallet size={14} />
            Spent
          </div>

          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {formatCrore(spent)}
          </p>
        </div>
      </div>

      {/* RISK */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/50">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Risk Score
        </span>

        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${riskStyles.dot}`} />

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${riskStyles.badge}`}
          >
            {risk.score}/100 · {risk.level}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fund utilization
          </p>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {utilization}%
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* EDIT */}
          <button
            type="button"
            onClick={() => onEdit(project)}
            title="Edit project"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
          >
            <Pencil size={16} />
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() => onDelete(project)}
            title="Delete project"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>

          {/* VIEW */}
          <button
            type="button"
            onClick={() => {
              window.location.href = `/projects/${project._id}`;
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-600 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            View
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
