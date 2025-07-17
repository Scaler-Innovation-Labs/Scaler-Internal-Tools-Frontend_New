import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { useAuth } from "@/hooks/use-auth";

export default function TicketOverview({ refreshTickets }: { refreshTickets?: () => void }) {
  const { fetchWithAuth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, resolutionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  // Remove date from form state
  // const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      setFiles(selected);
    }
  };
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        // Move useAuth inside the effect to avoid dependency loop
        const { fetchWithAuth } = require("@/hooks/use-auth").useAuth();
        const res = await fetchWithAuth(`${backendUrl}/api/issues`);
        if (!res.ok) throw new Error('Failed to fetch tickets');
        const data = await res.json();
        const total = data.length;
        const open = data.filter((t: any) => t.status === 'open' || t.status === 'Open').length;
        const resolved = data.filter((t: any) => t.status === 'resolved' || t.status === 'Resolved').length;
        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
        setStats({ total, open, resolved, resolutionRate });
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []); // Only run once on mount

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showModal]);
  return (
    <>
      <section className="w-full max-w-6xl mx-auto p-6 -mt-10  dark:bg-[#161616]">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-5 flex flex-col gap-2 dark:bg-[#161616] border border-gray-600 ">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Overview</h1>
            <button
              className="ml-8 bg-[#2E4CEE] hover:bg-[#221EBF] text-white font-semibold px-5 py-2 rounded-full text-sm flex items-center justify-center"
              onClick={() => setShowModal(true)}
            >
              + Create
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading stats...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className=" flex items-center justify-between ">
              <div className="flex gap-4">
                <div className="flex flex-col items-center bg-gray-100 px-6 py-2 rounded-lg min-w-[110px]">
                  <span className="text-blue-600 text-xl font-bold">{stats.total}</span>
                  <span className="text-gray-500 text-sm">Total Tickets</span>
                </div>
                <div className="flex flex-col items-center bg-orange-50 px-6 py-2 rounded-lg min-w-[110px]">
                  <span className="text-orange-500 text-xl font-bold">{stats.open}</span>
                  <span className="text-orange-500 text-sm">Open Tickets</span>
                </div>
                <div className="flex flex-col items-center bg-green-50 px-6 py-2 rounded-lg min-w-[110px]">
                  <span className="text-green-600 text-xl font-bold">{stats.resolved}</span>
                  <span className="text-green-600 text-sm">Resolved Tickets</span>
                </div>
              </div>
              <div className="flex-1 mx-8">
                <div className="flex items-center justify-between mb-1 ">
                  <span className="text-gray-700 font-medium dark:text-gray-400 ">Resolution Rate</span>
                  <span className="text-gray-700 font-medium dark:text-gray-400  ">{stats.resolutionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.resolutionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto relative animate-fade-in p-0 sm:p-0 max-h-screen overflow-y-auto dark:bg-[#161616]">
            {/* Header */}
            <div className="rounded-t-3xl bg-[#2E4CEE] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white text-xl font-bold">Create New Ticket</h2>
              <button type="button" className="text-white bg-blue-700 hover:bg-blue-900 rounded-full w-8 h-8 flex items-center justify-center transition absolute right-4 top-4" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
            </div>
            <div className="border-b border-gray-200"></div>
            {/* Form */}
            <form className="px-6 py-6  flex flex-col gap-3" onSubmit={async e => {
              e.preventDefault();
              setSubmitting(true);
              try {
                const today = new Date().toISOString().slice(0, 10);
                const formData = new FormData();
                formData.append('title', title);
                formData.append('location', location);
                formData.append('priority', priority);
                formData.append('description', description);
                formData.append('date', today);
                files.forEach(file => formData.append('attachments', file));
                const res = await fetchWithAuth(`${backendUrl}/api/issues`, {
                  method: 'POST',
                  body: formData,
                });
                if (!res.ok) throw new Error('Failed to create ticket');
                setShowModal(false);
                setTitle(""); setLocation(""); setPriority(""); setDescription(""); setFiles([]);
                if (refreshTickets) refreshTickets();
              } catch (err) {
                alert('Failed to create ticket');
              } finally {
                setSubmitting(false);
              }
            }}>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Issue Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a brief title for your issue" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm" required />
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="flex-1">
                  <label className="block text-gray-700 font-semibold mb-1">Location</label>
                  <select value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm dark:bg-[#161616]" required>
                    <option value="">Select a category</option>
                    <option>Micro North</option>
                    <option>Micro West</option>
                    <option>Classroom A</option>
                    <option>Classroom B</option>
                    <option>Classroom C</option>
                    <option>Innovation Lab</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-semibold mb-1">Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm dark:bg-[#161616]" required>
                    <option value="">Select a priority</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Detailed Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your issue in detail....." className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm" required />
              </div>
              {/* Attachments */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Attachments</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <div className="flex gap-2 flex-wrap">
                  {files.map(file => (
                    <img
                      key={file.name}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }}
                    />
                  ))}
                </div>
              </div>
              <div className="border border-blue-200 bg-blue-50 rounded-xl px-4 py-2 flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l7 4v6c0 5.25-3.5 10-7 10s-7-4.75-7-10V6l7-4z" /></svg>
                  <div>
                    <div className="font-semibold text-gray-700 text-lg flex items-center gap-2">Privacy Setting</div>
                    <div className="text-xs text-gray-500 mt-1">Only you have access to view your submitted reports and any responses from authorities.</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-500 transition"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition peer-checked:translate-x-5"></div>
                </label>
              </div>
              <button type="submit" className="w-full mt-2 bg-gradient-to-r from-[#2E4CEE] to-[#221EBF] text-white font-semibold py-3 rounded-lg text-lg shadow-lg hover:from-[#221EBF] hover:to-[#2E4CEE] transition" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 