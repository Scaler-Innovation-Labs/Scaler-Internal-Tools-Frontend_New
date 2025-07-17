"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TicketTable } from "./components";
import { useAuth } from "@/hooks/use-auth";
import type { Ticket } from "./types";
import TicketOverview from "./components/ticket-overview";

const statusOptions = ["all", "open", "in_progress", "resolved", "closed"];
const priorityOptions = ["all", "low", "medium", "high", "critical"];
const sortOptions = [
  { value: "date_desc", label: "Date (Newest)" },
  { value: "date_asc", label: "Date (Oldest)" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
];

export default function TicketsPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const [sortBy, setSortBy] = useState("date_desc");
  const [showSort, setShowSort] = useState(false);

  // Move fetchTickets out so it can be called from children
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${backendUrl}/api/issues`);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  let filtered = tickets;
  if (filterStatus !== "all") filtered = filtered.filter(t => t.status && t.status.toLowerCase() === filterStatus.toLowerCase());
  if (filterPriority !== "all") filtered = filtered.filter(t => t.priority && t.priority.toLowerCase() === filterPriority.toLowerCase());

  // Always sort by selected option
  let sorted = [...filtered];
  if (sortBy === "date_desc") {
    sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortBy === "date_asc") {
    sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortBy === "priority") {
    const order = { critical: 1, high: 2, medium: 3, low: 4 };
    sorted.sort((a, b) => (order[a.priority?.toLowerCase() || "low"] || 5) - (order[b.priority?.toLowerCase() || "low"] || 5));
  } else if (sortBy === "status") {
    const order = { open: 1, in_progress: 2, resolved: 3, closed: 4 };
    sorted.sort((a, b) => (order[a.status?.toLowerCase() || "open"] || 5) - (order[b.status?.toLowerCase() || "open"] || 5));
  }

  const handleLike = async (id: string) => {
    try {
      const res = await fetchWithAuth(`${backendUrl}/api/issues/${id}/like`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to like ticket');
      const data = await res.json();
      setTickets(tickets => tickets.map(t => t.id === id ? { ...t, likes: data.likes } : t));
    } catch (err) {
      alert('Failed to like ticket');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      const res = await fetchWithAuth(`${backendUrl}/api/issues/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete ticket');
      setTickets(tickets => tickets.filter(t => t.id !== id));
      await fetchTickets(); // Update overview stats after delete
    } catch (err) {
      alert('Failed to delete ticket');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-purple-50 flex flex-col items-center py-0 dark:bg-[#161616]">
        <header className="w-full max-w-6xl px-1 sm:px-4 py-3 sm:py-4 rounded-2xl mb-8 shadow-lg" style={{ background: 'linear-gradient(90deg, #2E4CEE 0%, #221EBF 60%, #040F75 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Ticket Status</h1>
              <p className="text-white/80 ">Raise your issues instantly</p>
            </div>
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ minWidth: 200 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              Notifications Setting
            </button>
          </div>
        </header>
        <TicketOverview tickets={tickets} setTickets={setTickets} refreshTickets={fetchTickets} />
        <section className="w-full max-w-6xl px-2 sm:px-4">
          <div className="bg-white rounded-2xl shadow-lg p-1 sm:p-6 dark:bg-[#161616] border border-gray-700 overflow-x-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-400">Your Tickets</h2>
              <div className="flex flex-col sm:flex-row gap-2 relative w-full sm:w-auto">
                {/* Sort Button & Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setShowSort(v => !v)}
                    className={`flex items-center gap-1 border border-gray-200 rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 text-sm font-medium dark:text-gray-400 dark:border-gray-700 dark:hover:bg-[#232323] transition w-full sm:w-auto ${showSort ? 'ring-2 ring-blue-400 border-blue-400' : ''}`}
                    aria-haspopup="true"
                    aria-expanded={showSort}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 16h13M3 8h13M9 20l-4-4 4-4M9 4l-4 4 4 4" /></svg>
                    <span>Sort</span>
                  </button>
                  {showSort && (
                    <div className="absolute right-0 top-11 z-20 bg-white dark:bg-[#232323] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-2 w-full max-w-xs sm:w-48 animate-fade-in">
                      {sortOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                          className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${sortBy === opt.value ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 dark:hover:bg-[#232323] text-gray-700 dark:text-gray-200'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Filter Button & Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilter(v => !v)}
                    className={`flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 text-sm font-medium dark:text-gray-400 dark:border-gray-700 dark:hover:bg-[#232323] transition w-full sm:w-auto ${showFilter ? 'ring-2 ring-blue-400 border-blue-400' : ''}`}
                    aria-haspopup="true"
                    aria-expanded={showFilter}
                  >
                    {/* Plus icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
                    <span>Filter</span>
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  {showFilter && (
                    <div className="absolute right-0 top-11 z-20 bg-white dark:bg-[#232323] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 w-full max-w-xs sm:w-64 animate-fade-in">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">Filter Tickets</span>
                        <button onClick={() => setShowFilter(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                      <hr className="mb-3 border-gray-200 dark:border-gray-700" />
                      <div className="mb-3">
                        <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">Status</div>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full border rounded-lg px-2 py-2 text-sm dark:bg-[#232323] dark:text-gray-200 focus:ring-2 focus:ring-blue-400">
                          {statusOptions.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('_',' ')}</option>)}
                        </select>
                      </div>
                      <div className="mb-3">
                        <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">Priority</div>
                        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="w-full border rounded-lg px-2 py-2 text-sm dark:bg-[#232323] dark:text-gray-200 focus:ring-2 focus:ring-blue-400">
                          {priorityOptions.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                        </select>
                      </div>
                      <button className="mt-2 w-full bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-700 transition" onClick={() => setShowFilter(false)}>Apply</button>
                    </div>
                  )}
                </div>
              </div>   
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading tickets...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : (
              <TicketTable tickets={sorted} onLike={handleLike} onDelete={handleDelete} />
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
