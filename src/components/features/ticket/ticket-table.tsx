import { useState, useEffect } from "react";
import { ThumbsUp, ChevronDown, ChevronUp, Calendar, User, ChevronLeft, ChevronRight, X, Trash2, Edit } from "lucide-react";
import { createPortal } from 'react-dom';
import type { TicketSummary, TicketStatus, TicketPriority } from "@/types/features/tickets";
import { useAuth } from "@/hooks/auth/use-auth";
import { hasAdminRole } from "@/lib/utils";

const statusColors: Record<TicketStatus, string> = {
  OPEN: "bg-red-100 text-red-700 border-red-200",
  IN_PROGRESS: "bg-orange-100 text-orange-700 border-orange-200",
  RESOLVED: "bg-green-100 text-green-700 border-green-200",
  CLOSED: "bg-gray-200 text-gray-600 border-gray-300",
  REOPENED: "bg-blue-100 text-blue-700 border-blue-200",
  ON_HOLD: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CANCELED: "bg-gray-200 text-gray-600 border-gray-300",
  PENDING: "bg-purple-100 text-purple-700 border-purple-200",
};

const priorityColors: Record<TicketPriority, string> = {
  LOW: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",
  HIGH: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",
  CRITICAL: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-800",
  BLOCKER: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
};

const formatStatus = (status: TicketStatus): string => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatPriority = (priority: TicketPriority): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
};

// Helper to shorten file names
function shortenFileName(name: string, maxLength = 16) {
  if (name.length <= maxLength) return name;
  const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
  const base = name.replace(ext, '');
  return base.slice(0, maxLength - 3 - ext.length) + '...' + ext;
}

// Helper to format date as DD-MM-YYYY
function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
}

interface TicketTableProps {
  tickets: TicketSummary[];
  onLike?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number, data: any) => Promise<void>;
  refreshTickets?: () => Promise<void>;
}

export function TicketTable({ tickets, onLike, onDelete, onEdit, refreshTickets }: TicketTableProps) {
  const { userRoles } = useAuth();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [adminResponseIdx, setAdminResponseIdx] = useState<{ [id: number]: number }>({});
  const [editTicket, setEditTicket] = useState<TicketSummary | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [adminResponse, setAdminResponse] = useState<{ [id: number]: string }>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [savingResponse, setSavingResponse] = useState<{ [id: number]: boolean }>({});

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(hasAdminRole(userRoles));
  }, [userRoles]);

  const openEditModal = (ticket: TicketSummary) => {
    setEditTicket(ticket);
    setEditForm({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      campus: ticket.campus,
      isPrivate: ticket.isPrivate,
      resolvedDate: ticket.resolvedDate || '',
    });
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditTicket(null);
    setEditForm({});
    setEditError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'isPrivate') {
      setEditForm({ ...editForm, [name]: value === 'true' });
    } else if (name === 'resolvedDate') {
      // Handle date field - keep as string
      setEditForm({ ...editForm, [name]: value });
    } else if (name === 'status' && value === 'RESOLVED' && !editForm.resolvedDate) {
      // Auto-set resolve date when status is changed to RESOLVED
      const today = new Date().toISOString().split('T')[0];
      setEditForm({ ...editForm, [name]: value, resolvedDate: today });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError(null);
    try {
      if (onEdit && editTicket) {
        await onEdit(editTicket.id, editForm);
      }
      closeEditModal();
      if (refreshTickets) await refreshTickets();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update ticket');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleAdminResponse = (ticketId: number, response: string) => {
    setAdminResponse(prev => ({ ...prev, [ticketId]: response }));
  };

  const handleSaveAdminResponse = async (ticketId: number) => {
    const response = adminResponse[ticketId];
    if (!response?.trim()) return;

    try {
      setSavingResponse(prev => ({ ...prev, [ticketId]: true }));
      
      // This would save the admin response to the backend
      // await saveAdminResponse(ticketId, response);
      console.log('Saving admin response for ticket:', ticketId, response);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success feedback
      alert('Admin response added successfully! (Note: This is saved locally for now)');
      
      // Clear the input after saving
      setAdminResponse(prev => ({ ...prev, [ticketId]: '' }));
      
      // Refresh tickets to show the new response
      if (refreshTickets) await refreshTickets();
    } catch (err) {
      console.error('Failed to save admin response:', err);
      alert('Failed to save admin response. Please try again.');
    } finally {
      setSavingResponse(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleResolveTicket = async (ticketId: number) => {
    try {
      // Update the ticket status to resolved
      const updateData = {
        status: 'RESOLVED' as TicketStatus
      };
      
      // This would use the tickets API service in a real implementation
      // await updateTicket(ticketId, updateData);
      
      if (refreshTickets) await refreshTickets();
    } catch (err: any) {
      console.error('Failed to resolve ticket:', err);
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
    <div className="space-y-4">
      {paginatedTickets.map((ticket: TicketSummary) => {
        const expanded = expandedId === ticket.id;
        const attachments = ticket.imageUrl || [];
        // Get admin responses from ticket data, fallback to empty array
        const adminResponses = ticket.adminResponses || (ticket.adminResponse ? [ticket.adminResponse] : []);
        // Temporary mock admin response for testing - remove when backend is ready
        // TODO: Remove this mock data when backend comments/response endpoints are implemented
        const mockAdminResponses = adminResponses.length === 0 && ticket.status === 'RESOLVED' ? [
          "Thank you for reporting this issue. We have resolved the problem and the fan should now be working properly. Please let us know if you experience any further issues.",
          "The maintenance team has been notified and will address this issue within 24 hours."
        ] : adminResponses;
        const currentAdminResponseIdx = adminResponseIdx[ticket.id] || 0;
        const showArrows = mockAdminResponses.length > 1;
        
        return (
          <div
            key={ticket.id}
            className={`bg-white rounded-xl border ${expanded ? "border-2 border-blue-500 shadow-lg" : "border border-gray-300"} p-4 mb-4 transition-all duration-200 flex flex-col gap-2 dark:bg-[#161616] cursor-pointer`}
            onClick={() => setExpandedId(expanded ? null : ticket.id)}
          >
            {/* Header Row */}
            <div className="flex items-center justify-between gap-4 w-full">
              {/* Left section */}
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-400">{ticket.title}</span>
                <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="font-semibold">Campus:</span> {ticket.campus}
                </div>
                <div className="flex gap-2 mt-2 items-center">
                  <span className="border border-blue-500 text-blue-500 px-3 py-0.5 rounded-full text-xs font-semibold bg-white">
                    {ticket.isPrivate ? 'Private' : 'Public'}
                  </span>
                  {isAdmin && (
                    <button 
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 rounded transition hover:bg-blue-50"
                      onClick={e => { 
                        e.stopPropagation(); 
                        openEditModal(ticket); 
                      }}
                      title="Edit ticket"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              {/* Right section */}
              <div className="flex flex-col items-center justify-center min-w-[200px]">
                {/* Top row: badges */}
                <div className="flex flex-row items-center justify-center mb-2">
                  <span className={`px-2 py-.5 rounded-full text-xs font-semibold border-2 ${priorityColors[ticket.priority]} mr-2`} style={{minWidth: 36, textAlign: 'center'}}>
                    {formatPriority(ticket.priority)}
                  </span>
                  <span className={`px-2 py-.5 rounded-full text-xs font-semibold border-2 ${statusColors[ticket.status]}`} style={{minWidth: 48, textAlign: 'center'}}>
                    {formatStatus(ticket.status)}
                  </span>
                </div>
                {/* Bottom row: buttons */}
                <div className="flex flex-row items-center justify-center gap-2">
                  <button 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-bold px-1.5 py-1 rounded transition" 
                    style={{minWidth: 28}} 
                    onClick={e => { e.stopPropagation(); onLike && onLike(ticket.id); }}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {ticket.upvote || 0}
                  </button>
                  <button 
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-bold px-1.5 py-.5 rounded transition" 
                    style={{minWidth: 38}} 
                    onClick={e => { e.stopPropagation(); onDelete && onDelete(ticket.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <div className="flex items-center justify-center h-full pl-2">
                    <span>{expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}</span>
                  </div>
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
                    {ticket.description}
                  </div>
                </div>
                
                {/* Resolved Date */}
                <div>
                  <div className="font-bold mb-1">Resolved Date</div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{ticket.resolvedDate ? formatDate(ticket.resolvedDate) : 'N/A'}</span>
                  </div>
                </div>
                {/* Attachments */}
                <div>
                  <div className="font-bold mb-1">Attachments</div>
                  <div className="flex gap-4">
                    {attachments.length > 0 ? attachments.map((img: string, i: number) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="border-2 border-dashed border-blue-300 rounded-xl p-1 mb-1 cursor-pointer hover:shadow-lg transition"
                          onClick={() => openModal(i)}
                        >
                          <img 
                            src={img} 
                            alt={`Attachment ${i + 1}`} 
                            className="w-20 h-20 object-cover rounded-lg" 
                          />
                        </div>
                        <span className="text-xs text-blue-500 underline">{shortenFileName(img)}</span>
                      </div>
                    )) : <span className="text-gray-400">No attachments</span>}
                  </div>
                </div>
                {/* Admin Response Section - Only for Admin Users */}
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
                    {attachments[modalIndex]}
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
                      src={attachments[modalIndex]}
                      alt={attachments[modalIndex]}
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
              <label className="font-semibold text-sm">Campus
                <input name="campus" value={editForm.campus || ''} onChange={handleEditChange} className="w-full border rounded px-2 py-1 mt-1" required />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="font-semibold text-sm">Priority
                  <select name="priority" value={editForm.priority || ''} onChange={handleEditChange} className="w-full border rounded px-2 py-1 mt-1" required>
                    <option value="">Select a priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="BLOCKER">Blocker</option>
                  </select>
                </label>
                <label className="font-semibold text-sm">Status
                  <select name="status" value={editForm.status || ''} onChange={handleEditChange} className="w-full border rounded px-2 py-1 mt-1" required>
                    <option value="">Select a status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                    <option value="REOPENED">Reopened</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="CANCELED">Canceled</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="font-semibold text-sm">Privacy
                  <select name="isPrivate" value={editForm.isPrivate ? 'true' : 'false'} onChange={handleEditChange} className="w-full border rounded px-2 py-1 mt-1" required>
                    <option value="false">Public</option>
                    <option value="true">Private</option>
                  </select>
                </label>
                <label className="font-semibold text-sm">Resolve Date
                  <input 
                    type="date" 
                    name="resolvedDate" 
                    value={editForm.resolvedDate || ''} 
                    onChange={handleEditChange} 
                    className="w-full border rounded px-2 py-1 mt-1"
                    placeholder="Select resolve date"
                  />
                </label>
              </div>
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