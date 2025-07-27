import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import { CalendarIcon, MapPinIcon } from "@/components/ui/primitives/icons";
import type { TicketSummary, TicketStatus, TicketPriority } from "@/types/features/tickets";

const priorityColors: Record<TicketPriority, string> = {
  LOW: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",
  HIGH: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",
  CRITICAL: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-800",
  BLOCKER: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
};

const statusColors: Record<TicketStatus, string> = {
  OPEN: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",
  IN_PROGRESS: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
  RESOLVED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
  CLOSED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800",
  REOPENED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800",
  ON_HOLD: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",
  CANCELED: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800",
  PENDING: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800",
};

const formatStatus = (status: TicketStatus): string => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatPriority = (priority: TicketPriority): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
};

export default function TicketList({ tickets }: { tickets: TicketSummary[] }) {
  return (
    <div className="bg-white dark:bg-black rounded-xl dark:border-gray-800 overflow-hidden dark:bg-[#161616]">
      {tickets.map((ticket, idx) => (
        <div
          key={ticket.id}
          className={`flex flex-col md:flex-row md:items-center justify-between px-4 py-3 border last:border-b-0 ${
            idx % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-50 dark:bg-gray-900'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1 min-w-0">
            <div className="min-w-[220px]">
              <div className="font-semibold text-[15px] text-blue-900 dark:text-blue-200 flex items-center gap-2">
                {ticket.title}
                <Badge variant="outline" className="ml-1 border-blue-200 text-blue-700 bg-blue-50">
                  {ticket.isPrivate ? 'Private' : 'Public'}
                </Badge>
                {ticket.isPrivate && (
                  <Button variant="outline" size="sm" className="ml-1 px-2 py-0 h-6 text-xs">
                    Edit
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" /> {ticket.campus}
                </span>
                {ticket.upvote > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {ticket.upvote}
                  </span>
                )}
                {/* Show admin response indicator */}
                {(ticket.adminResponses && ticket.adminResponses.length > 0) || 
                 (ticket.adminResponse) || 
                 (ticket.status === 'RESOLVED') ? (
                  <span className="flex items-center gap-1 text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    Admin Response
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center mt-2 md:mt-0">
            <Badge 
              variant="outline" 
              className={`border ${priorityColors[ticket.priority] || ''}`}
            >
              {formatPriority(ticket.priority)}
            </Badge>
            <Badge 
              variant="outline" 
              className={`border ${statusColors[ticket.status] || ''}`}
            >
              {formatStatus(ticket.status)}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
} 