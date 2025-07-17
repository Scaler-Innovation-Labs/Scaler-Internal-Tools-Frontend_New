import type { TicketTableProps } from "../types";
import { useState } from "react";
import { thumbup as Thumbup } from "@/components/ui/icons";
import { ChevronDown, ChevronUp, Calendar, Paperclip, User, ChevronLeft, ChevronRight, X, Trash2, Edit2 } from "lucide-react";
import { createPortal } from 'react-dom';

const statusColors: Record<string, string> = {
  resolved: "bg-green-100 text-green-700 border-green-200",
  in_progress: "bg-orange-100 text-orange-700 border-orange-200",
  open: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-gray-200 text-gray-600 border-gray-300",
};

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-600",
  medium: "bg-orange-50 text-orange-500",
  high: "bg-red-100 text-red-500",
  critical: "bg-pink-100 text-pink-700",
  blocker: "bg-amber-100 text-amber-800",
};

const visibilityColors: Record<string, string> = {
  Public: "bg-blue-50 text-blue-700 border border-blue-200",
  Private: "bg-gray-100 text-gray-700 border border-gray-300",
};

const priorityStyles: Record<string, string> = {
  Low: "bg-green-100 text-green-600",
  Medium: "bg-orange-50 text-orange-500",
  High: "bg-red-100 text-red-500",
  Critical: "bg-red-100 text-red-700",
  Blocker: "bg-amber-100 text-amber-800",
};

const statusStyles: Record<string, string> = {
  Open: "border border-red-500 text-red-500 bg-white",
  "In Progress": "border border-amber-700 text-amber-700 bg-white",
  Resolved: "border border-green-600 text-green-600 bg-white",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function TicketTable({ tickets, onLike, onDelete }: TicketTableProps & { onLike?: (id: string) => void, onDelete?: (id: string) => void }) {
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [adminResponseIdx, setAdminResponseIdx] = useState<{ [id: string]: number }>({});
  const attachmentImages = [
    { src: "/images/hostel_a.png", name: "hostel_a.png" },
    { src: "/images/hostel_b.png", name: "hostel_b.png" },
    { src: "/images/hostel_b.png", name: "hostel_b.png" },
  ];

  const openModal = (idx: number) => {
    setModalIndex(idx);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const prevImg = () => setModalIndex((i) => (i === 0 ? attachmentImages.length - 1 : i - 1));
  const nextImg = () => setModalIndex((i) => (i === attachmentImages.length - 1 ? 0 : i + 1));

  const handleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
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
                  <button className="flex items-center gap-1 border border-blue-500 text-blue-500 px-3 py-0.5 rounded-full text-xs font-semibold bg-white hover:bg-blue-50 transition"><Edit2 className="w-4 h-4" />Edit</button>
                </div>
              </div>
              {/* Right section */}
              <div className="flex items-center gap-2">
                {/* Priority badge: filled */}
                <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${priorityColors[(ticket.priority || '').toLowerCase()] || 'bg-gray-100 text-gray-500'}`}>{ticket.priority}</span>
                {/* Status badge: outlined */}
                {(() => {
                  const statusKey = ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).toLowerCase();
                  return (
                    <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${statusKey === 'Open' ? 'border-red-500 text-red-500 bg-white' : statusKey === 'In progress' ? 'border-amber-700 text-amber-700 bg-white' : statusKey === 'Resolved' ? 'border-green-600 text-green-600 bg-white' : 'border-gray-300 text-gray-500 bg-white'}`}>{ticket.status}</span>
                  );
                })()}
                <span className="flex items-center gap-1 text-blue-500 font-semibold">
                  <button onClick={e => { e.stopPropagation(); onLike && onLike(ticket.id); }} className="flex items-center gap-1 focus:outline-none">
                    <Thumbup className="w-5 h-5" />
                  </button>
                  {ticket.likes ?? 0}
                </span>
                <button onClick={e => { e.stopPropagation(); onDelete && onDelete(ticket.id); }} className="flex items-center gap-1 text-red-500 font-semibold hover:underline">
                  <Trash2 className="w-5 h-5" />Delete
                </button>
                <span className="ml-2">{expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}</span>
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
                        <span className="text-xs text-blue-500 underline">{typeof img === 'string' ? img : img.name}</span>
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
        <span className="text-gray-400 text-sm">Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, tickets.length)} of {tickets.length} entries</span>
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
    </div>
  );
} 