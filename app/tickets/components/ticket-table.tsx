import type { TicketTableProps } from "../types";
import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { ChevronDown, ChevronUp, Calendar, User, ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";
import { createPortal } from 'react-dom';

const statusColors: Record<string, string> = {
  resolved: "bg-green-100 text-green-700 border-green-200",
  in_progress: "bg-orange-100 text-orange-700 border-orange-200",
  open: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-gray-200 text-gray-600 border-gray-300",
};

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",
  high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",
  critical: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-800",
  blocker: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
};


// Helper to shorten file names
function shortenFileName(name: string, maxLength = 16) {
  if (name.length <= maxLength) return name;
  const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
  const base = name.replace(ext, '');
  return base.slice(0, maxLength - 3 - ext.length) + '...' + ext;
}

export function TicketTable({ tickets, onLike, onDelete, refreshTickets }: TicketTableProps & { onLike?: (id: string) => void, onDelete?: (id: string) => void, refreshTickets?: () => Promise<void> }) {
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [adminResponseIdx, setAdminResponseIdx] = useState<{ [id: string]: number }>({});
  const [editTicket, setEditTicket] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  const openEditModal = (ticket: any) => {
    setEditTicket(ticket);
    setEditForm({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      location: ticket.location,
      // Add more fields as needed
    });
    setEditError(null);
  };
  const closeEditModal = () => {
    setEditTicket(null);
    setEditForm({});
    setEditError(null);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError(null);
    try {
      const res = await fetch(`${backendUrl}/api/issues/${editTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update ticket');
      closeEditModal();
      if (refreshTickets) await refreshTickets();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update ticket');
    } finally {
      setEditSubmitting(false);
    }
  };

  const openModal = (idx: number) => {
    setModalIndex(idx);
    setModalOpen(true);
  };
  const perPage = 5;
  const totalPages = Math.ceil(tickets.length / perPage);
  const paginatedTickets = tickets.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4 ">
      {paginatedTickets.map((ticket: any) => {
        const expanded = expandedId === ticket.id;
        const attachments = ticket.attachments || [];
        const adminResponses = ticket.adminResponses || (ticket.adminResponse ? [ticket.adminResponse] : []);
        // Use the tracked index for this ticket
        const currentAdminResponseIdx = adminResponseIdx[ticket.id] || 0;
        const showArrows = adminResponses.length > 1;
        return (
          <div
            key={ticket.id}
            className={`bg-white rounded-xl border ${expanded ? "border-2 border-blue-500 shadow-lg" : "border border-gray-300"} p-4 mb-4 transition-all duration-200 flex flex-col gap-2 dark:bg-[#161616]  cursor-pointer`}
            onClick={() => setExpandedId(expanded ? null : ticket.id)}
          >
            {/* Header Row */}
            <div className="flex items-center justify-between gap-4 w-full">
              {/* Left section */}
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-400">{ticket.title || "Broken Fan - Room 125"}</span>
                <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{ticket.date || "16-06-2025"}</span>
                  <span className="font-semibold">Campus:</span> Macro
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="border border-blue-500 text-blue-500 px-3 py-0.5 rounded-full text-xs font-semibold bg-white">Public</span>
                </div>
              </div>
              {/* Right section */}
              <div className="flex flex-col items-center justify-center min-w-[200px]">
                {/* Top row: badges */}
                <div className="flex flex-row items-center justify-center mb-2">
                  <span className={`px-2 py-.5 rounded-full text-xs font-semibold border-2 ${priorityColors[ticket.priority?.toLowerCase()] || ''} mr-2`} style={{minWidth: 36, textAlign: 'center'}}>{ticket.priority}</span>
                  <span className={`px-2 py-.5 rounded-full text-xs font-semibold border-2 ${statusColors[ticket.status?.toLowerCase()] || ''}`} style={{minWidth: 48, textAlign: 'center'}}>{ticket.status}</span>
                </div>
                {/* Bottom row: buttons */}
                <div className="flex flex-row items-center justify-center gap-2">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-bold px-1.5 py-1 rounded transition" style={{minWidth: 28}} onClick={e => { e.stopPropagation(); onLike && onLike(ticket.id); }}>
                    <ThumbsUp className="w-4 h-4" />
                    {ticket.likes || 0}
                  </button>
                  <button className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-bold px-1.5 py-.5 rounded transition" style={{minWidth: 38}} onClick={e => { e.stopPropagation(); onDelete && onDelete(ticket.id); }}>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <div className="flex items-center justify-center h-full pl-2"><span>{expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}</span></div>

                </div>
              </div>
            </div>
            {/* Expanded Content */}
            {expanded && (
              <div className="mt-4 space-y-4" onClick={e => e.stopPropagation()}>
                {/* Description */}
                <div>
                  <div className="font-bold mb-1">Description</div>
                  <div className="text-gray-700 text-sm">
                    {ticket.description || "The fan is not functioning normally, at times it does not turn on at all. This has been ongoing for about a week now and is affecting sleep quality."}
                  </div>
                </div>
                {/* Resolved Date */}
                <div>
                  <div className="font-bold mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" />Resolved Date</div>
                  <div className="text-gray-700 text-sm">{ticket.resolvedDate || "20-06-2025"}</div>
                </div>
                {/* Attachments */}
                <div>
                  <div className="font-bold mb-1">Attachments</div>
                  <div className="flex gap-4  ">
                    {attachments.length > 0 ? attachments.map((img: any, i: number) => (
                      <div key={i} className="flex flex-col items-center ">
                        <div
                          className="border-2 border-dashed border-blue-300 rounded-xl p-1 mb-1 cursor-pointer hover:shadow-lg transition"
                          onClick={() => openModal(i)}
                        >
                          <img src={`http://localhost:8000/uploads/${typeof img === 'string' ? img : img.name}`} alt={typeof img === 'string' ? img : img.name} className="w-20 h-20 object-cover rounded-lg" />
                        </div>
                        <span className="text-xs text-blue-500 underline">{shortenFileName(typeof img === 'string' ? img : img.name)}</span>
                      </div>
                    )) : <span className="text-gray-400">No attachments</span>}
                  </div>
                </div>
                {/* Admin Response Carousel */}
                <div className="mt-2">
                  <div className="flex items-center w-full">
                    {/* Left Arrow */}
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 shadow mr-2"
                      onClick={e => { e.stopPropagation(); setAdminResponseIdx(idx => ({ ...idx, [ticket.id]: (currentAdminResponseIdx - 1 + adminResponses.length) % adminResponses.length })); }}
                      aria-label="Previous"
                      disabled={!showArrows}
                    >
                      <ChevronLeft className="text-blue-400 w-5 h-5" />
                    </button>
                    {/* Admin Response Card */}
                    <div className="flex-1 border border-blue-200 bg-blue-50 rounded-lg p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-1">
                        <User className="w-4 h-4" /> <span className="font-bold">Admin Response</span>
                      </div>
                      <div className="text-sm text-blue-900">
                        {adminResponses.length > 0 ? adminResponses[currentAdminResponseIdx] : 'No admin response yet.'}
                      </div>
                      {/* Carousel Dots */}
                      <div className="flex justify-center mt-2 gap-1">
                        {adminResponses.map((_: any, idx: number) => (
                          <span key={idx} className={`w-2 h-2 rounded-full ${currentAdminResponseIdx === idx ? "bg-blue-500" : "bg-gray-300"} inline-block`}></span>
                        ))}
                      </div>
                    </div>
                    {/* Right Arrow */}
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 shadow ml-2"
                      onClick={e => { e.stopPropagation(); setAdminResponseIdx(idx => ({ ...idx, [ticket.id]: (currentAdminResponseIdx + 1) % adminResponses.length })); }}
                      aria-label="Next"
                      disabled={!showArrows}
                    >
                      <ChevronRight className="text-blue-400 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Image Modal */}
            {expanded && modalOpen && attachments[modalIndex] && typeof window !== 'undefined' && document.body && createPortal(
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={() => setModalOpen(false)}
                style={{ animation: 'fadeIn 0.2s' }}
              >
                <div
                  className="relative bg-white dark:bg-[#232323] rounded-2xl shadow-2xl p-6 max-w-[90vw] max-h-[90vh] flex flex-col items-center"
                  style={{ animation: 'scaleIn 0.2s', minWidth: 320 }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white bg-white/80 dark:bg-[#232323]/80 rounded-full w-9 h-9 flex items-center justify-center shadow transition"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close"
                    style={{ fontSize: 28, fontWeight: 'bold' }}
                  >
                    &times;
                  </button>
                  {/* Filename */}
                  <div className="font-bold text-base mb-3 text-center text-gray-700 dark:text-gray-200 break-all">
                    {typeof attachments[modalIndex] === 'string' ? attachments[modalIndex] : attachments[modalIndex]?.name}
                  </div>
                  {/* Image with navigation arrows */}
                  <div className="relative flex items-center justify-center w-full h-full">
                    {/* Left Arrow */}
                    {attachments.length > 1 && (
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center transition z-10 hover:bg-blue-50"
                        onClick={e => {
                          e.stopPropagation();
                          setModalIndex((modalIndex - 1 + attachments.length) % attachments.length);
                        }}
                        aria-label="Previous"
                        style={{ fontWeight: 'bold' }}
                      >
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                    {/* Image */}
                    <img
                      src={`http://localhost:8000/uploads/${typeof attachments[modalIndex] === 'string' ? attachments[modalIndex] : attachments[modalIndex]?.name}`}
                      alt={typeof attachments[modalIndex] === 'string' ? attachments[modalIndex] : attachments[modalIndex]?.name}
                      style={{
                        maxWidth: '80vw',
                        maxHeight: '70vh',
                        objectFit: 'contain',
                        borderRadius: '16px',
                        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.15)'
                      }}
                    />
                    {/* Right Arrow */}
                    {attachments.length > 1 && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center transition z-10 hover:bg-blue-50"
                        onClick={e => {
                          e.stopPropagation();
                          setModalIndex((modalIndex + 1) % attachments.length);
                        }}
                        aria-label="Next"
                        style={{ fontWeight: 'bold' }}
                      >
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                {/* Optional: Add fade/scale keyframes in your global CSS */}
                <style>
                  {`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                  `}
                </style>
              </div>,
              document.body
            )}
          </div>
        );
      })}
      {/* Pagination and entry count */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-400 text-sm">
          {tickets.length === 0
            ? 'No entries'
            : `Showing ${(tickets.length === 0 ? 0 : (page - 1) * perPage + 1)} to ${tickets.length === 0 ? 0 : ((page - 1) * perPage + paginatedTickets.length)} of ${tickets.length} entries`}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-md flex items-center justify-center text-base font-semibold bg-gray-200 text-gray-400"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-base font-semibold ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="w-8 h-8 rounded-md flex items-center justify-center text-base font-semibold bg-gray-200 text-gray-400"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Edit Modal */}
      {editTicket && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={closeEditModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <label className="font-semibold text-sm">Title
                <input name="title" value={editForm.title || ''} onChange={handleEditChange} className="w-full border rounded px-2 py-1 mt-1" required />
              </label>
              <label className="font-semibold text-sm">Location
                <input name="location" value={editForm.location || ''} onChange={handleEditChange} className="w-full border rounded px-2 py-1 mt-1" required />
              </label>
              <label className="font-semibold text-sm">Priority
                <select name="priority" value={editForm.priority || ''} onChange={handleEditChange} className="w-full border rounded px-2 py-1 mt-1" required>
                  <option value="">Select a priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                  <option value="blocker">Blocker</option>
                </select>
              </label>
              <label className="font-semibold text-sm">Description
                <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} className="w-full border rounded px-2 py-1 mt-1" required />
              </label>
              {editError && <div className="text-red-500 text-xs">{editError}</div>}
              <div className="flex gap-2 mt-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={closeEditModal}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={editSubmitting}>{editSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 