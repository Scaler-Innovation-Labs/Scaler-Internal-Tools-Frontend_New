import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { useTicketingClient } from "@/hooks/api/use-ticketing-client";
import CreateTicketForm from "./create-ticket-form";
import TicketList from "./ticket-list";
import type { TicketCreateData, TicketSummary } from "@/types/features/tickets";

export default function TicketOverview() {
  const {
    tickets,
    stats,
    loading,
    error,
    fetchTickets,
    createTicket,
    clearError
  } = useTicketingClient({ autoRefresh: true, refreshInterval: 30000 });

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (data: TicketCreateData) => {
    setSubmitting(true);
    try {
      await createTicket(data);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    clearError();
  };

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
      <section className="w-full max-w-6xl mx-auto p-4 -mt-7 dark:bg-[#161616]">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-5 flex flex-col gap-2 dark:bg-[#161616] border border-gray-600">
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
            <div className="flex items-center justify-between">
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
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700 font-medium dark:text-gray-400">Resolution Rate</span>
                  <span className="text-gray-700 font-medium dark:text-gray-400">{stats.resolutionRate}%</span>
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

      {/* Create Ticket Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto relative animate-fade-in p-0 sm:p-0 max-h-screen overflow-y-auto dark:bg-[#161616]">
            {/* Header */}
            <div className="rounded-t-3xl bg-[#2E4CEE] px-6 py-4 flex items-center justify-between">
              <h2 className="text-white text-xl font-bold">Create New Ticket</h2>
              <button 
                type="button" 
                className="text-white bg-blue-700 hover:bg-blue-900 rounded-full w-8 h-8 flex items-center justify-center transition absolute right-4 top-4" 
                onClick={handleCancel} 
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="border-b border-gray-200"></div>
            
            {/* Form */}
            <div className="px-6 py-6">
              <CreateTicketForm
                onSubmit={handleCreateTicket}
                onCancel={handleCancel}
                loading={submitting}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 