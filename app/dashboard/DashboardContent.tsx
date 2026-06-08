"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Calendar,
  Briefcase,
  GraduationCap,
  Store,
  TrendingUp,
  Filter,
  X,
} from "lucide-react";

interface Submission {
  _id: string;
  firstName: string;
  email: string;
  whatsapp: string;
  profession: string;
  city: string;
  timestamp: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type SortField = "firstName" | "email" | "profession" | "city" | "createdAt";
type SortOrder = "asc" | "desc";

export default function DashboardContent() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [filterProf, setFilterProf] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async (pageOverride?: number) => {
    setLoading(true);
    const page = pageOverride ?? pagination.page;
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(pagination.limit));
    if (search) params.set("search", search);
    if (filterProf !== "All") params.set("profession", filterProf);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    params.set("sortField", sortField);
    params.set("sortOrder", sortOrder);

    try {
      const res = await fetch(`/api/submissions?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setSubmissions(json.data);
        setPagination(json.pagination);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterProf, sortField, sortOrder, dateFrom, dateTo]);

  // debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchData(1), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterProf !== "All") params.set("profession", filterProf);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);

    const res = await fetch(`/api/export?${params.toString()}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dlh_submissions_${new Date().toISOString().split("T")[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("dlh_admin_logged_in");
    window.location.href = "/login";
  };

  const clearFilters = () => {
    setSearch("");
    setFilterProf("All");
    setDateFrom("");
    setDateTo("");
    setSortField("createdAt");
    setSortOrder("desc");
  };

  const hasActiveFilters = search || filterProf !== "All" || dateFrom || dateTo;

  const stats = useMemo(() => {
    const total = pagination.total;
    const today = new Date().toDateString();
    const todayCount = submissions.filter(
      (s) => new Date(s.createdAt).toDateString() === today
    ).length;
    const profCounts: Record<string, number> = {};
    submissions.forEach((s) => {
      profCounts[s.profession] = (profCounts[s.profession] ?? 0) + 1;
    });
    return { total, todayCount, profCounts };
  }, [submissions, pagination.total]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#10B981]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#10B981]" />
    );
  };

  const profColor: Record<string, string> = {
    Job: "bg-blue-50 text-blue-700 border-blue-100",
    Student: "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Business Owner": "bg-amber-50 text-amber-700 border-amber-100",
    Freelancer: "bg-purple-50 text-purple-700 border-purple-100",
    Other: "bg-gray-50 text-gray-600 border-gray-100",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Submissions</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage and export webinar registrations</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View Page
          </Link>
          <button
            onClick={handleExport}
            className="rounded-lg bg-[#10B981] px-4 py-2 text-sm font-medium text-white hover:bg-[#059669] transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export Excel
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{stats.todayCount}</p>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{stats.profCounts["Job"] ?? 0}</p>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Job</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{stats.profCounts["Student"] ?? 0}</p>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, city, phone..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? "border-[#10B981] text-[#10B981] bg-emerald-50"
                : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-[#10B981] text-white text-[10px] flex items-center justify-center">
                {[search, filterProf !== "All" ? 1 : 0, dateFrom, dateTo].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-medium text-gray-400 mb-1 block">Profession</label>
              <select
                value={filterProf}
                onChange={(e) => setFilterProf(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 appearance-none cursor-pointer"
              >
                <option>All</option>
                <option>Job</option>
                <option>Student</option>
                <option>Business Owner</option>
                <option>Freelancer</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-400 mb-1 block">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-400 mb-1 block">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-gray-100 border-t-[#10B981] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-20 text-center">
            <Store className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-sm">No submissions found</p>
            <p className="text-xs text-gray-400 mt-1">
              {hasActiveFilters ? "Try adjusting your filters" : "Once users register, their data will appear here"}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-3 text-sm text-[#10B981] font-medium hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider w-10">#</th>
                  <th
                    className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-600 select-none"
                    onClick={() => handleSort("firstName")}
                  >
                    <span className="flex items-center gap-1">Name <SortIcon field="firstName" /></span>
                  </th>
                  <th
                    className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-600 select-none"
                    onClick={() => handleSort("email")}
                  >
                    <span className="flex items-center gap-1">Email <SortIcon field="email" /></span>
                  </th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider">WhatsApp</th>
                  <th
                    className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-600 select-none"
                    onClick={() => handleSort("profession")}
                  >
                    <span className="flex items-center gap-1">Profession <SortIcon field="profession" /></span>
                  </th>
                  <th
                    className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-600 select-none"
                    onClick={() => handleSort("city")}
                  >
                    <span className="flex items-center gap-1">City <SortIcon field="city" /></span>
                  </th>
                  <th
                    className="text-left px-5 py-3.5 font-medium text-gray-400 text-xs uppercase tracking-wider cursor-pointer hover:text-gray-600 select-none"
                    onClick={() => handleSort("createdAt")}
                  >
                    <span className="flex items-center gap-1">Date <SortIcon field="createdAt" /></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => (
                  <tr key={sub._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-300 text-xs font-medium">{(pagination.page - 1) * pagination.limit + i + 1}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{sub.firstName}</td>
                    <td className="px-5 py-3.5 text-gray-500">{sub.email}</td>
                    <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{sub.whatsapp}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${profColor[sub.profession] ?? profColor.Other}`}>
                        {sub.profession}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{sub.city}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      <span className="text-gray-300 ml-1">
                        {new Date(sub.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchData(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchData(p)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  p === pagination.page
                    ? "bg-[#10B981] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => fetchData(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
