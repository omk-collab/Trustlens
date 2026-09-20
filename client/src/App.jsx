import { useEffect, useMemo, useState } from "react";

import ProjectMap from "./components/ProjectMap";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  LayoutDashboard,
  MapPin,
  Moon,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Sun,
  Trash2,
  Wallet,
  X,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ProjectCard from "./components/ProjectCard";
import ProjectDetails from "./components/ProjectDetails";

const API = "http://localhost:8000";

function formatCrore(amount = 0) {
  return `₹${(amount / 10000000).toFixed(2)} Cr`;
}

/* =========================
   DASHBOARD CARD
========================= */

function DashboardCard({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Icon size={21} />
        </div>
      </div>

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <h3 className="mt-1 font-[Plus_Jakarta_Sans] text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

/* =========================
   SECTION HEADER
========================= */

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <Icon size={20} className="text-blue-600 dark:text-blue-400" />

        <h2 className="font-[Plus_Jakarta_Sans] text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================
   FORM INPUT
========================= */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
      />
    </div>
  );
}

/* =========================
   FORM SELECT
========================= */

function FormSelect({ label, value, onChange, children, required = false }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      >
        {children}
      </select>
    </div>
  );
}

/* =========================
   PROJECT MODAL
========================= */

function ProjectModal({
  open,
  editingProject,
  form,
  setForm,
  onClose,
  onSubmit,
  saving,
}) {
  if (!open) return null;

  const isEdit = Boolean(editingProject);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-800">
          <div>
            <h2 className="font-[Plus_Jakarta_Sans] text-xl font-bold text-slate-900 dark:text-white">
              {isEdit ? "Edit Project" : "Add New Project"}
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isEdit
                ? "Update project information and monitoring data."
                : "Create a new project for TrustLens monitoring."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={onSubmit} className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-7">
            {/* BASIC INFORMATION */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Building2
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />

                <h3 className="font-[Plus_Jakarta_Sans] font-bold text-slate-900 dark:text-white">
                  Basic Information
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Project Name"
                  value={form.name}
                  required
                  placeholder="e.g. Smart Road Rehabilitation"
                  onChange={(e) => updateField("name", e.target.value)}
                />

                <FormInput
                  label="Category"
                  value={form.category}
                  required
                  placeholder="e.g. Infrastructure"
                  onChange={(e) => updateField("category", e.target.value)}
                />

                <FormInput
                  label="Location"
                  value={form.location}
                  required
                  placeholder="e.g. Pune, Maharashtra"
                  onChange={(e) => updateField("location", e.target.value)}
                />

                <FormSelect
                  label="Status"
                  value={form.status}
                  required
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </FormSelect>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    placeholder="Describe the project..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* FINANCIAL */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Wallet
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />

                <h3 className="font-[Plus_Jakarta_Sans] font-bold text-slate-900 dark:text-white">
                  Financial Information
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormInput
                  label="Sanctioned Amount"
                  type="number"
                  required
                  value={form.sanctionedAmount}
                  placeholder="10000000"
                  onChange={(e) =>
                    updateField("sanctionedAmount", e.target.value)
                  }
                />

                <FormInput
                  label="Released Amount"
                  type="number"
                  value={form.releasedAmount}
                  placeholder="7000000"
                  onChange={(e) =>
                    updateField("releasedAmount", e.target.value)
                  }
                />

                <FormInput
                  label="Spent Amount"
                  type="number"
                  value={form.spentAmount}
                  placeholder="4000000"
                  onChange={(e) => updateField("spentAmount", e.target.value)}
                />
              </div>
            </div>

            {/* EXECUTION */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <MapPin
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />

                <h3 className="font-[Plus_Jakarta_Sans] font-bold text-slate-900 dark:text-white">
                  Execution Information
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormInput
                  label="Implementing Agency"
                  value={form.implementingAgency}
                  placeholder="Government Agency"
                  onChange={(e) =>
                    updateField("implementingAgency", e.target.value)
                  }
                />

                <FormInput
                  label="Vendor / Contractor"
                  value={form.vendor}
                  placeholder="ABC Infrastructure Pvt Ltd"
                  onChange={(e) => updateField("vendor", e.target.value)}
                />

                <FormInput
                  label="Contract Amount"
                  type="number"
                  value={form.contractAmount}
                  placeholder="8000000"
                  onChange={(e) =>
                    updateField("contractAmount", e.target.value)
                  }
                />
              </div>
            </div>

            {/* PROGRESS */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Activity
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />

                <h3 className="font-[Plus_Jakarta_Sans] font-bold text-slate-900 dark:text-white">
                  Progress
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label="Physical Progress (%)"
                  type="number"
                  value={form.physicalProgress}
                  min="0"
                  max="100"
                  placeholder="45"
                  onChange={(e) =>
                    updateField("physicalProgress", e.target.value)
                  }
                />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Progress Preview
                  </label>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Physical Progress
                      </span>

                      <span className="font-bold text-slate-800 dark:text-white">
                        {Math.min(
                          Math.max(Number(form.physicalProgress) || 0, 0),
                          100,
                        )}
                        %
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                        style={{
                          width: `${Math.min(
                            Math.max(Number(form.physicalProgress) || 0, 0),
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DEMO NOTICE */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-200">
              <p className="font-semibold">Synthetic demonstration data</p>

              <p className="mt-1 opacity-80">
                This project is being created for the TrustLens hackathon
                demonstration.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  {isEdit ? <Pencil size={16} /> : <Plus size={17} />}

                  {isEdit ? "Update Project" : "Create Project"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   DELETE MODAL
========================= */

function DeleteModal({ project, deleting, onClose, onConfirm }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <Trash2 size={22} />
          </div>

          <div>
            <h2 className="font-[Plus_Jakarta_Sans] text-lg font-bold text-slate-900 dark:text-white">
              Delete Project?
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {project.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   TOAST
========================= */

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const success = toast.type === "success";

  return (
    <div className="fixed right-4 top-4 z-[200] w-[calc(100%-2rem)] max-w-sm animate-[slideIn_0.3s_ease-out]">
      <div
        className={`rounded-2xl border bg-white p-4 shadow-2xl dark:bg-slate-900 ${
          success
            ? "border-emerald-200 dark:border-emerald-500/20"
            : "border-red-200 dark:border-red-500/20"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              success
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {success ? <CheckCircle2 size={19} /> : <ShieldAlert size={19} />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {toast.title}
            </p>

            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   EMPTY FORM
========================= */

const EMPTY_FORM = {
  name: "",
  category: "",
  location: "",
  description: "",
  sanctionedAmount: "",
  releasedAmount: "",
  spentAmount: "",
  implementingAgency: "",
  vendor: "",
  contractAmount: "",
  physicalProgress: "",
  status: "Not Started",
};

/* =========================
   HOME PAGE
========================= */

function HomePage({ darkMode, toggleTheme }) {
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ADD / EDIT */
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  /* DELETE */
  const [deleteProject, setDeleteProject] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* TOAST */
  const [toast, setToast] = useState(null);

  function showToast(type, title, message) {
    setToast({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  /* =========================
     LOAD DASHBOARD
  ========================= */

  async function loadDashboard() {
    try {
      const [projectsRes, summaryRes] = await Promise.all([
        fetch(`${API}/api/projects`),
        fetch(`${API}/api/projects/dashboard/summary`),
      ]);

      const projectsJson = await projectsRes.json();
      const summaryJson = await summaryRes.json();

      if (projectsJson.success) {
        setProjects(projectsJson.data || []);
      }

      if (summaryJson.success) {
        setSummary(summaryJson.data);
      }
    } catch (error) {
      console.error("Dashboard loading failed:", error);

      showToast(
        "error",
        "Connection Error",
        "Unable to load project data from the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =========================
     OPEN ADD
  ========================= */

  function openAddProject() {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setShowProjectModal(true);
  }

  /* =========================
     OPEN EDIT
  ========================= */

  function openEditProject(project) {
    setEditingProject(project);

    setForm({
      name: project?.name || "",
      category: project?.category || "",
      location: project?.location || "",
      description: project?.description || "",

      sanctionedAmount: project?.financial?.sanctionedAmount ?? "",

      releasedAmount: project?.financial?.releasedAmount ?? "",

      spentAmount: project?.financial?.spentAmount ?? "",

      implementingAgency: project?.execution?.implementingAgency || "",

      vendor: project?.execution?.vendor || "",

      contractAmount: project?.execution?.contractAmount ?? "",

      physicalProgress: project?.progress?.physicalProgress ?? "",

      status: project?.progress?.status || "Not Started",
    });

    setShowProjectModal(true);
  }

  /* =========================
     ADD / UPDATE PROJECT
  ========================= */

  async function handleProjectSubmit(e) {
    e.preventDefault();

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      location: form.location.trim(),
      description: form.description.trim(),

      financial: {
        sanctionedAmount: Number(form.sanctionedAmount) || 0,
        releasedAmount: Number(form.releasedAmount) || 0,
        spentAmount: Number(form.spentAmount) || 0,
      },

      execution: {
        implementingAgency: form.implementingAgency.trim(),

        vendor: form.vendor.trim(),

        contractAmount: Number(form.contractAmount) || 0,
      },

      progress: {
        physicalProgress: Math.min(
          Math.max(Number(form.physicalProgress) || 0, 0),
          100,
        ),

        status: form.status,
      },
    };

    try {
      /* =========================
         UPDATE
      ========================= */

      if (editingProject) {
        const response = await fetch(
          `${API}/api/projects/${editingProject._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update project");
        }

        setProjects((prev) =>
          prev.map((project) =>
            project._id === editingProject._id ? result.data : project,
          ),
        );

        setShowProjectModal(false);
        setEditingProject(null);
        setForm(EMPTY_FORM);

        showToast(
          "success",
          "Project Updated",
          "Project details were updated successfully.",
        );

        await loadDashboard();

        return;
      }

      /* =========================
         CREATE
      ========================= */

      const response = await fetch(`${API}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create project");
      }

      setProjects((prev) => [result.data, ...prev]);

      setShowProjectModal(false);
      setForm(EMPTY_FORM);

      showToast(
        "success",
        "Project Created",
        "New project has been added successfully.",
      );

      await loadDashboard();
    } catch (error) {
      console.error("Project save failed:", error);

      showToast(
        "error",
        "Action Failed",
        error.message || "Unable to save project.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     DELETE PROJECT
  ========================= */

  async function handleDeleteProject() {
    if (!deleteProject?._id) return;

    setDeleting(true);

    try {
      const response = await fetch(`${API}/api/projects/${deleteProject._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete project");
      }

      setProjects((prev) =>
        prev.filter((project) => project._id !== deleteProject._id),
      );

      setDeleteProject(null);

      showToast(
        "success",
        "Project Deleted",
        "The project was removed successfully.",
      );

      await loadDashboard();
    } catch (error) {
      console.error("Project deletion failed:", error);

      showToast(
        "error",
        "Delete Failed",
        error.message || "Unable to delete project.",
      );
    } finally {
      setDeleting(false);
    }
  }

  /* =========================
     SEARCH
  ========================= */

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return projects;

    return projects.filter((project) => {
      return (
        project?.name?.toLowerCase().includes(term) ||
        project?.category?.toLowerCase().includes(term) ||
        project?.location?.toLowerCase().includes(term)
      );
    });
  }, [projects, search]);

  /* =========================
     STATUS DATA
  ========================= */

  const statusData = useMemo(() => {
    const counts = {
      "In Progress": 0,
      Completed: 0,
      "Not Started": 0,
    };

    projects.forEach((project) => {
      const status = project?.progress?.status || "Not Started";

      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
      }));
  }, [projects]);

  /* =========================
     FINANCIAL DATA
  ========================= */

  const financialData = useMemo(() => {
    return projects.map((project) => ({
      name:
        project?.name?.length > 18
          ? `${project.name.slice(0, 18)}...`
          : project?.name,

      sanctioned: (project?.financial?.sanctionedAmount || 0) / 10000000,

      spent: (project?.financial?.spentAmount || 0) / 10000000,
    }));
  }, [projects]);

  /* =========================
     PROGRESS DATA
  ========================= */

  const progressData = useMemo(() => {
    return projects.map((project) => ({
      name:
        project?.name?.length > 16
          ? `${project.name.slice(0, 16)}...`
          : project?.name,

      progress: project?.progress?.physicalProgress || 0,

      risk: project?.risk?.score || 0,
    }));
  }, [projects]);

  /* =========================
     RISK DATA
  ========================= */

  const riskData = useMemo(() => {
    const counts = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    projects.forEach((project) => {
      const level = project?.risk?.level || "LOW";

      if (counts[level] !== undefined) {
        counts[level]++;
      }
    });

    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
      }));
  }, [projects]);

  const riskColors = {
    LOW: "#10b981",
    MEDIUM: "#f59e0b",
    HIGH: "#f97316",
    CRITICAL: "#ef4444",
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* TOAST */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ADD / EDIT MODAL */}
      <ProjectModal
        open={showProjectModal}
        editingProject={editingProject}
        form={form}
        setForm={setForm}
        onClose={() => {
          if (!saving) {
            setShowProjectModal(false);
            setEditingProject(null);
            setForm(EMPTY_FORM);
          }
        }}
        onSubmit={handleProjectSubmit}
        saving={saving}
      />

      {/* DELETE MODAL */}
      <DeleteModal
        project={deleteProject}
        deleting={deleting}
        onClose={() => {
          if (!deleting) {
            setDeleteProject(null);
          }
        }}
        onConfirm={handleDeleteProject}
      />

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-600/20">
              <ShieldAlert size={22} />
            </div>

            <div>
              <h1 className="font-[Plus_Jakarta_Sans] text-lg font-extrabold">
                TrustLens
              </h1>

              <p className="hidden text-[11px] text-slate-500 sm:block dark:text-slate-400">
                Public Project Intelligence
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#home" className="hover:text-blue-600">
              Home
            </a>

            <a href="#dashboard" className="text-blue-600">
              Dashboard
            </a>

            <a href="#projects" className="hover:text-blue-600">
              Projects
            </a>

            <a href="#analytics" className="hover:text-blue-600">
              Analytics
            </a>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </nav>

      {/* =========================
          HERO
      ========================= */}

      <section
        id="home"
        className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800"
      >
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl justify-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
              <Activity size={14} />
              LIVE PROJECT INTELLIGENCE
            </div>

            <h1 className="font-[Plus_Jakarta_Sans] text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              See where public funds
              <span className="block text-blue-600 dark:text-blue-400">
                actually go.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              TrustLens connects project finances, execution progress and risk
              signals into one transparent intelligence platform.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <a
                href="#dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore Dashboard
                <ArrowRight size={17} />
              </a>

              <a
                href="#projects"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          DASHBOARD
      ========================= */}

      <main
        id="dashboard"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <SectionHeader
            icon={LayoutDashboard}
            title="TrustLens Dashboard"
            description="Live overview powered by your MongoDB Atlas project data."
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading project intelligence...
            </p>
          </div>
        ) : (
          <>
            {/* STATS */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                icon={Building2}
                title="Total Projects"
                value={summary?.totalProjects ?? projects.length}
                subtitle="Projects tracked"
              />

              <DashboardCard
                icon={Wallet}
                title="Total Sanctioned"
                value={formatCrore(summary?.totalSanctionedAmount)}
                subtitle="Approved project funds"
              />

              <DashboardCard
                icon={CircleDollarSign}
                title="Total Spent"
                value={formatCrore(summary?.totalSpentAmount)}
                subtitle="Reported expenditure"
              />

              <DashboardCard
                icon={ShieldAlert}
                title="Average Risk"
                value={`${Math.round(
                  projects.reduce((sum, p) => sum + (p?.risk?.score || 0), 0) /
                    Math.max(projects.length, 1),
                )}/100`}
                subtitle="Across tracked projects"
              />
            </div>

            {/* CHARTS */}

            <section id="analytics" className="mt-10">
              <SectionHeader
                icon={BarChart3}
                title="Project Analytics"
                description="Interactive financial, progress and risk visualization."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                {/* FINANCIAL */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="font-[Plus_Jakarta_Sans] font-bold">
                    Sanctioned vs Spent
                  </h3>

                  <p className="mb-5 text-xs text-slate-500 dark:text-slate-400">
                    Amounts shown in ₹ Crore
                  </p>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-slate-200 dark:stroke-slate-800"
                        />

                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          interval={0}
                          angle={-20}
                          textAnchor="end"
                          height={65}
                        />

                        <YAxis tick={{ fontSize: 11 }} />

                        <Tooltip />
                        <Legend />

                        <Bar
                          dataKey="sanctioned"
                          name="Sanctioned"
                          fill="#3b82f6"
                          radius={[5, 5, 0, 0]}
                        />

                        <Bar
                          dataKey="spent"
                          name="Spent"
                          fill="#10b981"
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* PROGRESS */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="font-[Plus_Jakarta_Sans] font-bold">
                    Physical Progress
                  </h3>

                  <p className="mb-5 text-xs text-slate-500 dark:text-slate-400">
                    Reported project completion percentage
                  </p>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={progressData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-slate-200 dark:stroke-slate-800"
                        />

                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          interval={0}
                          angle={-20}
                          textAnchor="end"
                          height={65}
                        />

                        <YAxis domain={[0, 100]} />

                        <Tooltip />

                        <Bar
                          dataKey="progress"
                          name="Progress %"
                          fill="#8b5cf6"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* STATUS */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="font-[Plus_Jakarta_Sans] font-bold">
                    Project Status
                  </h3>

                  <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                    Current execution status
                  </p>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label
                        >
                          {statusData.map((entry, index) => (
                            <Cell
                              key={`status-${index}`}
                              fill={
                                entry.name === "Completed"
                                  ? "#10b981"
                                  : entry.name === "In Progress"
                                    ? "#3b82f6"
                                    : "#94a3b8"
                              }
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* RISK */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="font-[Plus_Jakarta_Sans] font-bold">
                    Risk Distribution
                  </h3>

                  <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                    Current project risk signals
                  </p>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label
                        >
                          {riskData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={riskColors[entry.name]}
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================
                PROJECTS
            ========================= */}
            <ProjectMap projects={projects} />
            <section id="projects" className="mt-12">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader
                  icon={Building2}
                  title="Active Projects"
                  description={`${projects.length} projects currently tracked by TrustLens.`}
                />

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  {/* SEARCH */}

                  <div className="relative w-full sm:w-72">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>

                  {/* ADD PROJECT */}

                  <button
                    type="button"
                    onClick={openAddProject}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    <Plus size={17} />
                    Add Project
                  </button>
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
                  <Search className="mx-auto text-slate-400" />

                  <p className="mt-3 text-sm text-slate-500">
                    No projects found.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onEdit={openEditProject}
                      onDelete={setDeleteProject}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* TRUST NOTICE */}

            <div className="mt-10 flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-200">
              <ShieldAlert className="mt-0.5 shrink-0" size={19} />

              <div>
                <p className="font-semibold">TrustLens Risk Notice</p>

                <p className="mt-1 text-xs leading-5 opacity-80">
                  Risk scores are anomaly signals generated from project data.
                  They are not proof of fraud, misconduct or wrongdoing and
                  should be independently verified.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 dark:text-slate-400">
          <p>© 2026 TrustLens</p>

          <p className="text-xs">
            Synthetic demonstration data for hackathon purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* =========================
   APP
========================= */

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("trustlens-theme") === "dark";
  });

  function toggleTheme() {
    setDarkMode((current) => {
      const next = !current;

      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("trustlens-theme", next ? "dark" : "light");

      return next;
    });
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("trustlens-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const path = window.location.pathname;

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);

  if (projectMatch) {
    return (
      <ProjectDetails
        projectId={projectMatch[1]}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  return <HomePage darkMode={darkMode} toggleTheme={toggleTheme} />;
}
