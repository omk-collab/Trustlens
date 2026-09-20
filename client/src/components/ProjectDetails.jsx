import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MapPinned,
  Moon,
  Navigation,
  Plus,
  ShieldCheck,
  Sun,
  Trash2,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import EvidenceMap from "./EvidenceMap";

const API = "http://localhost:8000";

const formatCurrency = (value = 0) => {
  const amount = Number(value || 0);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getRiskClass = (level = "LOW") => {
  switch (String(level).toUpperCase()) {
    case "CRITICAL":
      return "bg-red-500/15 text-red-400 border-red-500/20";

    case "HIGH":
      return "bg-orange-500/15 text-orange-400 border-orange-500/20";

    case "MEDIUM":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20";

    default:
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
  }
};

const getStatusClass = (status = "") => {
  switch (String(status).toUpperCase()) {
    case "COMPLETED":
      return "bg-emerald-500/15 text-emerald-400";

    case "IN_PROGRESS":
      return "bg-blue-500/15 text-blue-400";

    case "DELAYED":
      return "bg-red-500/15 text-red-400";

    default:
      return "bg-slate-500/15 text-slate-400";
  }
};

function SectionTitle({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>

          {description && (
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:border-slate-700">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Icon size={19} />
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">{value}</p>

      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-800/70 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-400">{label}</span>

      <span className="text-sm font-medium text-slate-200 sm:text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="m-5 flex min-h-[210px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/20 px-5 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-400">
        <Icon size={24} />
      </div>

      <h3 className="text-base font-semibold text-slate-200">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}

function EvidenceModal({ projectId, onClose, onSuccess }) {
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    type: "PHOTO",
    description: "",
    capturedDate: new Date().toISOString().slice(0, 10),
    latitude: "",
    longitude: "",
  });

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));

        setError("");
      },
      () => {
        setError(
          "Unable to get current location. Please enter latitude and longitude manually.",
        );
      },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select an evidence image.");
      return;
    }

    if (!form.title.trim()) {
      setError("Evidence title is required.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("evidence", file);
      formData.append("projectId", projectId);
      formData.append("type", form.type);
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("capturedDate", form.capturedDate);

      if (form.latitude) {
        formData.append("latitude", form.latitude);
      }

      if (form.longitude) {
        formData.append("longitude", form.longitude);
      }

      const response = await fetch(`${API}/api/evidence`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Failed to upload evidence",
        );
      }

      onSuccess(result.data);
      onClose();
    } catch (uploadError) {
      console.error("Evidence upload failed:", uploadError);

      setError(uploadError.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">Upload Evidence</h2>

            <p className="mt-1 text-xs text-slate-500">
              Add geotagged project evidence for verification.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Evidence Image
            </label>

            <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-5 text-center transition hover:border-blue-500/50 hover:bg-slate-900">
              {preview ? (
                <img
                  src={preview}
                  alt="Evidence preview"
                  className="max-h-52 rounded-xl object-contain"
                />
              ) : (
                <>
                  <Upload className="mb-3 text-blue-400" size={30} />

                  <p className="text-sm font-medium text-slate-300">
                    Click to select an image
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or other image files up to 10 MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && (
              <p className="mt-2 truncate text-xs text-slate-500">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Road construction progress"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Evidence Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="PHOTO">PHOTO</option>
                <option value="DOCUMENT">DOCUMENT</option>
                <option value="VIDEO">VIDEO</option>
                <option value="REPORT">REPORT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what this evidence shows..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Captured Date
            </label>

            <input
              type="date"
              name="capturedDate"
              value={form.capturedDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-300">
                Location
              </label>

              <button
                type="button"
                onClick={useCurrentLocation}
                className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400 transition hover:bg-blue-500/20"
              >
                <Navigation size={14} />
                Use Current Location
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={17} />
                  Upload Evidence
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectDetails({ projectId, darkMode, setDarkMode }) {
  const [project, setProject] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [reconciliation, setReconciliation] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [risk, setRisk] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const tabs = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "fund-flow",
      label: "Fund Flow",
    },
    {
      id: "transactions",
      label: "Transactions",
    },
    {
      id: "progress",
      label: "Progress",
    },
    {
      id: "evidence",
      label: "Evidence",
    },
    {
      id: "risk",
      label: "Risk Analysis",
    },
  ];

  useEffect(() => {
    if (!projectId) return;

    const loadProjectData = async () => {
      setLoading(true);
      setError("");

      try {
        const responses = await Promise.all([
          fetch(`${API}/api/projects/${projectId}`),
          fetch(`${API}/api/transactions/project/${projectId}`),
          fetch(`${API}/api/transactions/reconcile/${projectId}`),
          fetch(`${API}/api/milestones/project/${projectId}`),
          fetch(`${API}/api/milestones/timeline/${projectId}`),
          fetch(`${API}/api/evidence/project/${projectId}`),
          fetch(`${API}/api/risk/financial/${projectId}`),
        ]);

        const [
          projectResponse,
          transactionResponse,
          reconciliationResponse,
          milestoneResponse,
          timelineResponse,
          evidenceResponse,
          riskResponse,
        ] = responses;

        if (!projectResponse.ok) {
          throw new Error("Failed to load project");
        }

        const projectResult = await projectResponse.json();

        const transactionResult = transactionResponse.ok
          ? await transactionResponse.json()
          : { data: [] };

        const reconciliationResult = reconciliationResponse.ok
          ? await reconciliationResponse.json()
          : { data: null };

        const milestoneResult = milestoneResponse.ok
          ? await milestoneResponse.json()
          : { data: [] };

        const timelineResult = timelineResponse.ok
          ? await timelineResponse.json()
          : { data: null };

        const evidenceResult = evidenceResponse.ok
          ? await evidenceResponse.json()
          : { data: [] };

        const riskResult = riskResponse.ok
          ? await riskResponse.json()
          : { data: null };

        setProject(projectResult.data);

        setTransactions(transactionResult.data || []);

        setReconciliation(reconciliationResult.data || reconciliationResult);

        setMilestones(milestoneResult.data || []);

        setTimeline(timelineResult.data || timelineResult);

        setEvidence(evidenceResult.data || []);

        setRisk(riskResult.data || riskResult);
      } catch (loadError) {
        console.error("Project details loading failed:", loadError);

        setError(loadError.message || "Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [projectId]);

  const financial = project?.financial || {};
  const execution = project?.execution || {};
  const progress = project?.progress || {};

  const sanctionedAmount = Number(financial.sanctionedAmount || 0);

  const releasedAmount = Number(financial.releasedAmount || 0);

  const spentAmount = Number(financial.spentAmount || 0);

  const remainingAmount = Math.max(sanctionedAmount - spentAmount, 0);

  const spentPercentage =
    sanctionedAmount > 0
      ? Math.round((spentAmount / sanctionedAmount) * 100)
      : 0;

  const releasedPercentage =
    sanctionedAmount > 0
      ? Math.round((releasedAmount / sanctionedAmount) * 100)
      : 0;

  const completedMilestones = useMemo(() => {
    return milestones.filter(
      (item) => String(item.status).toUpperCase() === "COMPLETED",
    ).length;
  }, [milestones]);

  const averageProgress = useMemo(() => {
    if (!milestones.length) {
      return Number(progress.physicalProgress || 0);
    }

    const total = milestones.reduce(
      (sum, item) => sum + Number(item.progress || 0),
      0,
    );

    return Math.round(total / milestones.length);
  }, [milestones, progress.physicalProgress]);

 const riskScore = Number(
   risk?.riskScore ?? risk?.score ?? project?.risk?.score ?? 0,
 );
  const riskLevel = risk?.level || project?.risk?.level || "LOW";

  const riskFactors = risk?.factors || project?.risk?.factors || [];

  const handleEvidenceSuccess = (newEvidence) => {
    setEvidence((previous) => [newEvidence, ...previous]);
  };

  const handleVerifyEvidence = async (id) => {
    setActionLoading(true);

    try {
      const response = await fetch(`${API}/api/evidence/verify/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationNote: "Evidence verified",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Failed to verify evidence",
        );
      }

      setEvidence((previous) =>
        previous.map((item) => (item._id === id ? result.data : item)),
      );
    } catch (verifyError) {
      console.error("Evidence verification failed:", verifyError);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvidence = async (id) => {
    setActionLoading(true);

    try {
      const response = await fetch(`${API}/api/evidence/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Failed to delete evidence",
        );
      }

      setEvidence((previous) => previous.filter((item) => item._id !== id));
    } catch (deleteError) {
      console.error("Evidence deletion failed:", deleteError);
    } finally {
      setActionLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CircleDollarSign}
          label="Sanctioned Amount"
          value={formatCurrency(sanctionedAmount)}
          description="Approved project budget"
        />

        <MetricCard
          icon={Wallet}
          label="Released Amount"
          value={formatCurrency(releasedAmount)}
          description={`${releasedPercentage}% of sanctioned`}
        />

        <MetricCard
          icon={BarChart3}
          label="Spent Amount"
          value={formatCurrency(spentAmount)}
          description={`${spentPercentage}% of sanctioned`}
        />

        <MetricCard
          icon={Activity}
          label="Physical Progress"
          value={`${Number(progress.physicalProgress || 0)}%`}
          description={progress.status || "Not Started"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <SectionTitle
            icon={Building2}
            title="Project Information"
            description="Core project details"
          />

          <div className="px-6">
            <InfoRow label="Project Name" value={project?.name} />

            <InfoRow label="Category" value={project?.category} />

            <InfoRow label="Location" value={project?.location} />

            <InfoRow
              label="Implementing Agency"
              value={execution.implementingAgency}
            />

            <InfoRow label="Vendor / Contractor" value={execution.vendor} />

            <InfoRow
              label="Contract Amount"
              value={formatCurrency(execution.contractAmount)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <SectionTitle
            icon={CircleDollarSign}
            title="Financial Snapshot"
            description="Current fund position"
          />

          <div className="px-6">
            <InfoRow
              label="Sanctioned"
              value={formatCurrency(sanctionedAmount)}
            />

            <InfoRow label="Released" value={formatCurrency(releasedAmount)} />

            <InfoRow label="Spent" value={formatCurrency(spentAmount)} />

            <InfoRow
              label="Remaining"
              value={formatCurrency(remainingAmount)}
            />

            <InfoRow
              label="Release Utilisation"
              value={`${releasedPercentage}%`}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
        <SectionTitle
          icon={Activity}
          title="Project Progress"
          description="Physical execution status"
        />

        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-slate-400">Overall progress</span>

            <span className="text-sm font-bold text-white">
              {Number(progress.physicalProgress || 0)}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${Math.min(
                  Number(progress.physicalProgress || 0),
                  100,
                )}%`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Status: {progress.status || "Not Started"}</span>

            <span>
              {completedMilestones}/{milestones.length} milestones completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFundFlow = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
      <SectionTitle
        icon={CircleDollarSign}
        title="Fund Flow"
        description="Track how sanctioned funds move through the project"
      />

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Sanctioned
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {formatCurrency(sanctionedAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Released
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-400">
              {formatCurrency(releasedAmount)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Spent
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {formatCurrency(spentAmount)}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-slate-400">Fund utilisation</span>

            <span className="text-sm font-semibold text-white">
              {spentPercentage}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${Math.min(spentPercentage, 100)}%`,
              }}
            />
          </div>
        </div>

        {reconciliation && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">
              Reconciliation
            </h3>

            <div className="space-y-1">
              <InfoRow
                label="Sanctioned Amount"
                value={formatCurrency(
                  reconciliation.sanctionedAmount ?? sanctionedAmount,
                )}
              />

              <InfoRow
                label="Total Released"
                value={formatCurrency(
                  reconciliation.totalReleased ?? releasedAmount,
                )}
              />

              <InfoRow
                label="Total Spent"
                value={formatCurrency(reconciliation.totalSpent ?? spentAmount)}
              />

              <InfoRow
                label="Difference"
                value={formatCurrency(reconciliation.difference ?? 0)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
      <SectionTitle
        icon={Wallet}
        title="Transactions"
        description="Recorded financial movements for this project"
      />

      {transactions.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No transactions found"
          description="No transaction records are available for this project yet."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">To</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                      {item.transactionType || "TRANSACTION"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-white">
                    {formatCurrency(item.amount)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {item.from || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {item.to || "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-400">
                    {formatDate(item.transactionDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Activity}
          label="Overall Progress"
          value={`${averageProgress}%`}
          description="Calculated project progress"
        />

        <MetricCard
          icon={CheckCircle2}
          label="Completed"
          value={completedMilestones}
          description={`of ${milestones.length} milestones`}
        />

        <MetricCard
          icon={CalendarDays}
          label="Evidence Records"
          value={evidence.length}
          description="Project evidence submitted"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
        <SectionTitle
          icon={CalendarDays}
          title="Milestone Timeline"
          description="Project execution milestones"
        />

        {milestones.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No milestones found"
            description="No milestone records are available for this project yet."
          />
        ) : (
          <div className="space-y-4 p-6">
            {milestones.map((milestone) => (
              <div
                key={milestone._id}
                className="rounded-2xl border border-slate-800 bg-slate-950/30 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      {milestone.title}
                    </h3>

                    {milestone.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {milestone.description}
                      </p>
                    )}
                  </div>

                  <span
                    className={`w-fit rounded-lg px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                      milestone.status,
                    )}`}
                  >
                    {milestone.status || "PENDING"}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Progress</span>

                    <span className="text-xs font-semibold text-slate-300">
                      {Number(milestone.progress || 0)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          Number(milestone.progress || 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500">
                  <span>Target: {formatDate(milestone.targetDate)}</span>

                  {milestone.completedDate && (
                    <span>
                      Completed: {formatDate(milestone.completedDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderEvidence = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
      <SectionTitle
        icon={ShieldCheck}
        title="Evidence"
        description="Project evidence and verification records"
        action={
          <button
            type="button"
            onClick={() => setShowEvidenceModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Plus size={17} />
            Add Evidence
          </button>
        }
      />

      <EvidenceMap evidence={evidence} projectName={project?.name} />

      {evidence.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No evidence found"
          description="Upload project photos or other evidence to start building the verification trail."
        />
      ) : (
        <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {evidence.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 transition hover:border-slate-700"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.title || "Evidence"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-600">
                    <ImageIcon size={35} />
                  </div>
                )}

                <div className="absolute left-3 top-3">
                  <span className="rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    {item.type || "PHOTO"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white">
                    {item.title || "Untitled Evidence"}
                  </h3>

                  {item.verified ? (
                    <span className="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                      VERIFIED
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-lg bg-yellow-500/10 px-2 py-1 text-[10px] font-semibold text-yellow-400">
                      PENDING
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                )}

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={13} />
                    {formatDate(item.capturedDate)}
                  </div>

                  {item.location?.latitude && item.location?.longitude && (
                    <div className="flex items-center gap-2">
                      <MapPin size={13} />

                      <span>
                        {Number(item.location.latitude).toFixed(5)},{" "}
                        {Number(item.location.longitude).toFixed(5)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20"
                    >
                      <ImageIcon size={14} />
                      View Image
                    </a>
                  )}

                  {!item.verified && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleVerifyEvidence(item._id)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      Verify
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleDeleteEvidence(item._id)}
                    className="flex items-center justify-center rounded-lg bg-red-500/10 px-3 py-2 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRisk = () => (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Current Risk Score
          </p>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-bold text-white">{riskScore}</span>

            <span className="mb-2 text-sm text-slate-500">/100</span>
          </div>

          <div className="mt-5">
            <span
              className={`inline-flex rounded-xl border px-3 py-1.5 text-xs font-bold ${getRiskClass(
                riskLevel,
              )}`}
            >
              {riskLevel} RISK
            </span>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${Math.min(riskScore, 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-bold text-white">Risk Factors</h2>

              <p className="text-xs text-slate-500">
                Signals identified by the TrustLens risk engine
              </p>
            </div>
          </div>

          {riskFactors.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-500">
              No specific risk factors have been recorded.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {riskFactors.map((factor, index) => (
                <div
                  key={`${factor}-${index}`}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/30 p-4"
                >
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />

                  <p className="text-sm leading-6 text-slate-300">{factor}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 shrink-0 text-blue-400" size={19} />

          <div>
            <h3 className="text-sm font-semibold text-blue-300">
              Risk score is an anomaly signal
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              A higher score indicates that the available project data contains
              signals that may require additional verification. It does not by
              itself establish wrongdoing or fraud.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "fund-flow":
        return renderFundFlow();

      case "transactions":
        return renderTransactions();

      case "progress":
        return renderProgress();

      case "evidence":
        return renderEvidence();

      case "risk":
        return renderRisk();

      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center gap-3">
          <Loader2 size={22} className="animate-spin text-blue-400" />

          <span className="text-sm">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <h2 className="text-lg font-bold text-white">
            Unable to load project
          </h2>

          <p className="mt-2 text-sm text-red-400">
            {error || "Project not found"}
          </p>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-4 lg:px-7">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-base font-bold text-white">TrustLens</h1>

              <p className="text-xs text-slate-500">Project Intelligence</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const nextDark =
                !document.documentElement.classList.contains("dark");

              document.documentElement.classList.toggle("dark", nextDark);
              localStorage.setItem(
                "trustlens-theme",
                nextDark ? "dark" : "light",
              );

              setDarkMode(nextDark);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1300px] px-4 py-5 sm:px-5 lg:px-7 lg:py-7">
        {/* Project Header */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-400">
                  {project.category}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getRiskClass(
                    riskLevel,
                  )}`}
                >
                  {riskLevel} RISK
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {project.name}
              </h2>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {project.location}
                </span>

                {execution.implementingAgency && (
                  <span className="flex items-center gap-2">
                    <Building2 size={16} />
                    {execution.implementingAgency}
                  </span>
                )}
              </div>

              {project.description && (
                <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-400">
                  {project.description}
                </p>
              )}
            </div>

            <div className="shrink-0 rounded-2xl bg-slate-800/80 px-6 py-5 lg:min-w-[125px]">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Risk Score
              </p>

              <div className="mt-1">
                <span className="text-4xl font-bold text-white">
                  {riskScore}
                </span>

                <span className="text-sm text-slate-500">/100</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-1.5">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Content */}
        <div className="mt-6">{renderActiveTab()}</div>
      </main>

      {showEvidenceModal && (
        <EvidenceModal
          projectId={projectId}
          onClose={() => setShowEvidenceModal(false)}
          onSuccess={handleEvidenceSuccess}
        />
      )}
    </div>
  );
}
