"use client";
import { useState, useEffect } from "react";
import { TicketTable } from "@/components/features/ticket";
import TicketOverview from "@/components/features/ticket/ticket-overview";
import { useTicketingClient } from "@/hooks/api/use-ticketing-client";
import type { TicketStatus, TicketPriority, CampusType } from "@/types/features/tickets";

const statusOptions: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REOPENED", "ON_HOLD", "CANCELED", "PENDING"];
const priorityOptions: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL", "BLOCKER"];
const campusOptions: CampusType[] = ["MICRO_CAMPUS", "MACRO_CAMPUS"];
const sortOptions = [
  { value: "date_desc", label: "Date (Newest)" },
  { value: "date_asc", label: "Date (Oldest)" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
];

export default function TicketsPage() {
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<TicketPriority | "all">("all");
  const [filterCampus, setFilterCampus] = useState<CampusType | "all">("all");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("date_desc");
  const [showSort, setShowSort] = useState(false);

  const {
    tickets,
    loading,
    error,
    fetchTickets,
    upvoteTicket,
    deleteTicket,
    updateTicket,
    getTicketsByStatus,
    getTicketsByPriority,
    getTicketsByCampus,
    clearError
  } = useTicketingClient({ autoRefresh: true, refreshInterval: 30000 });

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  let filtered = tickets;
  
  // Apply filters
  if (filterStatus !== "all") {
    filtered = filtered.filter(t => t.ticketStatus === filterStatus);
  }
  if (filterPriority !== "all") {
    filtered = filtered.filter(t => t.priority === filterPriority);
  }
  if (filterCampus !== "all") {
    filtered = filtered.filter(t => t.campus === filterCampus);
  }

  // Sort tickets
  let sorted = [...filtered];
  if (sortBy === "date_desc") {
    sorted.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } else if (sortBy === "date_asc") {
    sorted.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
  } else if (sortBy === "priority") {
    const order: Record<TicketPriority, number> = { BLOCKER: 1, CRITICAL: 2, HIGH: 3, MEDIUM: 4, LOW: 5 };
    sorted.sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (sortBy === "status") {
    const order: Record<TicketStatus, number> = { 
      OPEN: 1, IN_PROGRESS: 2, PENDING: 3, ON_HOLD: 4, REOPENED: 5, RESOLVED: 6, CLOSED: 7, CANCELED: 8 
    };
    sorted.sort((a, b) => order[a.ticketStatus] - order[b.ticketStatus]);
  }

  const handleUpvote = async (id: number) => {
    try {
      await upvoteTicket(id);
    } catch (err) {
      console.error('Failed to upvote ticket:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await deleteTicket(id);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    }
  };

  const handleEdit = async (id: number, data: any) => {
    try {
      await updateTicket(id, data);
    } catch (err) {
      console.error('Failed to update ticket:', err);
      throw err;
    }
  };

  const handleFilterChange = async (type: 'status' | 'priority' | 'campus', value: string) => {
    if (value === 'all') {
      await fetchTickets();
      return;
    }

    try {
      let filteredTickets;
      switch (type) {
        case 'status':
          filteredTickets = await getTicketsByStatus(value as TicketStatus);
          break;
        case 'priority':
          filteredTickets = await getTicketsByPriority(value as TicketPriority);
          break;
        case 'campus':
          filteredTickets = await getTicketsByCampus(value as CampusType);
          break;
        default:
          return;
      }
      // Note: The hook will update the tickets state automatically
    } catch (err) {
      console.error(`Failed to filter tickets by ${type}:`, err);
    }
  };

  const formatStatus = (status: TicketStatus): string => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority: TicketPriority): string => {
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  };

  const formatCampus = (campus: CampusType): string => {
    return campus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center  dark:bg-[#161616]">
      <header className="w-full max-w-6xl p-4 sm:px-4 mx-2 sm:mx-4 rounded-2xl mb-8 shadow-lg" style={{ background: 'linear-gradient(90deg, #2E4CEE 0%, #221EBF 60%, #040F75 100%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Ticket Status</h1>
            <p className="text-white/80">Raise your issues instantly</p>
          </div>
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ minWidth: 200 }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifications Setting
          </button>
        </div>
      </header>
      
      <TicketOverview />
      
      <section className="w-full max-w-6xl px-1 sm:px-4 mx-2 sm:mx-4">
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 16h13M3 8h13M9 20l-4-4 4-4M9 4l-4 4 4 4" />
                  </svg>
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  <span>Filter</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {showFilter && (
                  <div className="absolute right-0 top-11 z-20 bg-white dark:bg-[#232323] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 w-full max-w-xs sm:w-64 animate-fade-in">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">Filter Tickets</span>
                      <button onClick={() => setShowFilter(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <hr className="mb-3 border-gray-200 dark:border-gray-700" />
                    <div className="mb-3">
                      <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">Status</div>
                      <select 
                        value={filterStatus} 
                        onChange={e => {
                          setFilterStatus(e.target.value as TicketStatus | "all");
                          if (e.target.value !== "all") {
                            handleFilterChange('status', e.target.value);
                          }
                        }} 
                        className="w-full border rounded-lg px-2 py-2 text-sm dark:bg-[#232323] dark:text-gray-200 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="all">All Statuses</option>
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>
                            {formatStatus(opt)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">Priority</div>
                      <select 
                        value={filterPriority} 
                        onChange={e => {
                          setFilterPriority(e.target.value as TicketPriority | "all");
                          if (e.target.value !== "all") {
                            handleFilterChange('priority', e.target.value);
                          }
                        }} 
                        className="w-full border rounded-lg px-2 py-2 text-sm dark:bg-[#232323] dark:text-gray-200 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="all">All Priorities</option>
                        {priorityOptions.map(opt => (
                          <option key={opt} value={opt}>
                            {formatPriority(opt)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">Campus</div>
                      <select 
                        value={filterCampus} 
                        onChange={e => {
                          setFilterCampus(e.target.value as CampusType | "all");
                          if (e.target.value !== "all") {
                            handleFilterChange('campus', e.target.value);
                          }
                        }} 
                        className="w-full border rounded-lg px-2 py-2 text-sm dark:bg-[#232323] dark:text-gray-200 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="all">All Campuses</option>
                        {campusOptions.map(opt => (
                          <option key={opt} value={opt}>
                            {formatCampus(opt)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button 
                      className="mt-2 w-full bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-700 transition" 
                      onClick={() => setShowFilter(false)}
                    >
                      Apply
                    </button>
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
            <TicketTable 
              tickets={sorted} 
              onLike={handleUpvote} 
              onDelete={handleDelete} 
              onEdit={handleEdit}
              refreshTickets={fetchTickets}
            />
          )}
        </div>
      </section>
    </div>
  );
} 