import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon } from "@/components/ui/icons";

interface Ticket {
  id: number;
  title: string;
  date: string;
  location: string;
  visibility: string;
  status: string;
  priority: string;
  description: string;
  resolvedDate: string | null;
  attachments: string[];
  adminResponse: string | null;
}

const priorityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800",
  High: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",
  Critical: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-800",
  Blocker: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
};

const statusColors: Record<string, string> = {
  Resolved: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800",
  "In Progress": "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800",
  Open: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800",
};

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="bg-white dark:bg-black rounded-xl  dark:border-gray-800 overflow-hidden dark:bg-[#161616]">
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
                <Badge variant="outline" className="ml-1 border-blue-200 text-blue-700 bg-blue-50">{ticket.visibility}</Badge>
                {ticket.visibility === 'Private' && (
                  <Button variant="outline" size="sm" className="ml-1 px-2 py-0 h-6 text-xs">Edit</Button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-300">
                <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {ticket.date}</span>
                <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {ticket.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center mt-2 md:mt-0">
            <Badge variant="outline" className={`border ${priorityColors[ticket.priority] || ''}`}>{ticket.priority}</Badge>
            <Badge variant="outline" className={`border ${statusColors[ticket.status] || ''}`}>{ticket.status}</Badge>
            {ticket.attachments.length > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
                <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 10-5.656-5.656l-7.07 7.07a6 6 0 108.485 8.485l7.071-7.07" /></svg>
                {ticket.attachments.length}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 