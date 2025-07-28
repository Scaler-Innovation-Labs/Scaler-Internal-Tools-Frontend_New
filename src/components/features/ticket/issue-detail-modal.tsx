import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { useAuth } from "@/hooks/auth/use-auth";
import type { IssueDetailModalProps, TicketStatus, TicketPriority } from "@/types/features/tickets";
import { hasAdminRole } from "@/lib/utils";

export default function IssueDetailModal({ issue, onClose, isAuthorizedUser = false }: IssueDetailModalProps) {
  const { fetchWithAuth, userRoles } = useAuth();
  const isAdmin = hasAdminRole(userRoles);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: issue.title,
    description: issue.description,
    priority: issue.priority || "MEDIUM" as TicketPriority,
    ticketStatus: issue.ticketStatus || "PENDING" as TicketStatus,
    campus: issue.campus,
    private: issue.private || false,
    imageUrl: issue.imageUrl || []
  });
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    // Load comments
    loadComments();
  }, [issue.id]);

  const loadComments = async () => {
    try {
      const response = await fetchWithAuth(`${backendUrl}/api/issues/${issue.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`${backendUrl}/api/issues/${issue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to update ticket');
      
      setIsEditMode(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updateData: any = { ticketStatus: newStatus };
      
      // Add resolve date when status is changed to resolved
      if (newStatus === 'RESOLVED') {
        const now = new Date();
        updateData.resolvedDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
      
      const response = await fetchWithAuth(`${backendUrl}/api/issues/${issue.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state
      setFormData(prev => ({ ...prev, ticketStatus: newStatus as TicketStatus }));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAssigneeChange = async (newAssignee: string) => {
    try {
      const response = await fetchWithAuth(`${backendUrl}/api/issues/${issue.id}/assignee`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignee: newAssignee }),
      });
      
      if (!response.ok) throw new Error('Failed to update assignee');
      
      // Note: assignee is not part of the Ticket interface, so we don't update local state
    } catch (err) {
      console.error('Failed to update assignee:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await fetchWithAuth(`${backendUrl}/api/issues/${issue.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      });
      
      if (!response.ok) throw new Error('Failed to add comment');
      
      setNewComment("");
      await loadComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleAddAdminResponse = async () => {
    if (!adminResponse.trim()) return;
    
    try {
      const response = await fetchWithAuth(`${backendUrl}/api/issues/${issue.id}/admin-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: adminResponse }),
      });
      
      if (!response.ok) throw new Error('Failed to add admin response');
      
      setAdminResponse("");
      // Refresh the issue data
      onClose();
    } catch (err) {
      console.error('Failed to add admin response:', err);
    }
  };

  const handleResolveTicket = async () => {
    try {
      const now = new Date();
      const resolveDate = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      const response = await fetchWithAuth(`${backendUrl}/api/issues/${issue.id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticketStatus: 'RESOLVED',
          resolvedDate: resolveDate 
        }),
      });
      
      if (!response.ok) throw new Error('Failed to resolve ticket');
      
      // Refresh the issue data
      onClose();
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;
    
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetchWithAuth(`${backendUrl}/api/issues/${issue.id}/images`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload images');
      
      // Refresh the issue data
      onClose();
    } catch (err) {
      console.error('Failed to upload images:', err);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#232323] rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Ticket' : 'Ticket Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isEditMode ? (
            /* Edit Form */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TicketPriority }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                  >
                    <option value="">Select Priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="BLOCKER">Blocker</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.ticketStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, ticketStatus: e.target.value as TicketStatus }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                  >
                    <option value="">Select Status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                    <option value="REOPENED">Reopened</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="CANCELED">Canceled</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {issue.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {issue.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className="font-medium">{issue.ticketStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Priority:</span>
                    <span className="font-medium">{issue.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Campus:</span>
                    <span className="font-medium">{issue.campus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Created:</span>
                    <span className="font-medium">
                      {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </div>
                  {issue.resolvedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Resolved Date:</span>
                      <span className="font-medium">
                        {new Date(issue.resolvedDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Upvotes:</span>
                    <span className="font-medium">{issue.upvote}</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              {isAuthorizedUser && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Admin Actions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Change Status
                      </label>
                      <select
                        value={issue.ticketStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                        <option value="REOPENED">Reopened</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="CANCELED">Canceled</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Assign To
                      </label>
                      <select
                        onChange={(e) => handleAssigneeChange(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                      >
                        <option value="">Unassigned</option>
                        <option value="admin1">Admin 1</option>
                        <option value="admin2">Admin 2</option>
                        <option value="admin3">Admin 3</option>
                      </select>
                    </div>
                    
                    {/* Only show image upload if there are existing images */}
                    {(issue.imageUrl && issue.imageUrl.length > 0) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Upload Images
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Response Section - Only for Admin Users */}
              {isAdmin && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Admin Response
                  </h4>
                  
                  <div className="space-y-3">
                    <textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Add admin response..."
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddAdminResponse}
                        disabled={!adminResponse.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Response
                      </button>
                      
                      {/* Resolve Button */}
                      {issue.ticketStatus !== 'RESOLVED' && (
                        <button
                          onClick={handleResolveTicket}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Resolve Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Comments
                </h4>
                
                <div className="space-y-3 mb-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{comment.author || 'Anonymous'}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#161616] dark:text-white"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isAuthorizedUser && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Ticket
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
} 