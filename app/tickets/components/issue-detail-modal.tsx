import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from "@/hooks/use-auth";
import { useNotification } from "@/components/ui/notification-context";

interface IssueDetailModalProps {
  issue: any;
  onClose: () => void;
  isAuthorizedUser?: boolean;
}

export default function IssueDetailModal({ issue, onClose, isAuthorizedUser = true }: IssueDetailModalProps) {
  const { fetchWithAuth } = useAuth();
  const notify = useNotification();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [status, setStatus] = useState(issue.status);
  const [assignee, setAssignee] = useState(issue.assignee || 'Unassigned');
  const [saving, setSaving] = useState(false);
  const [privacy, setPrivacy] = useState(issue.visibility === 'Private');
  const [attachments, setAttachments] = useState<string[]>(issue.attachments || []);
  const [newFiles, setNewFiles] = useState<File[]>([]); // For new uploads
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ title?: string; description?: string; save?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | HTMLInputElement | null>(null);

  // Fetch issue details, comments, history, assignees
  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(`/api/issues/${issue.id}`);
        if (!res.ok) throw new Error("Failed to fetch issue details");
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status);
        setAssignee(data.assignee || 'Unassigned');
        setPrivacy(data.visibility === 'Private');
        setAttachments(data.attachments || []);
        setHistory(data.history || []);
        setAssignees(data.assignees || []);
        // Fetch comments
        const cres = await fetchWithAuth(`/api/issues/${issue.id}/comments`);
        if (cres.ok) {
          setComments(await cres.json());
        } else {
          setComments([]);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Focus trap and ESC close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!firstEl || !lastEl) return;
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    // Focus close button on open
    setTimeout(() => {
      if (closeButtonRef.current) closeButtonRef.current.focus();
    }, 0);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleSave() {
    // Validation
    const errors: { title?: string; description?: string } = {};
    if (!title.trim()) errors.title = 'Title is required.';
    if (!description.trim()) errors.description = 'Description is required.';
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    setValidationErrors({});
    setError(null);
    try {
      // Upload new files if any (simulate, or use FormData if backend supports)
      let uploadedFiles: string[] = [];
      if (newFiles.length > 0) {
        // Example: upload to /api/issues/{id}/attachments (adjust as needed)
        const formData = new FormData();
        newFiles.forEach(f => formData.append('files', f));
        const uploadRes = await fetchWithAuth(`/api/issues/${issue.id}/attachments`, {
          method: 'POST',
          body: formData,
          headers: {}, // Let browser set Content-Type for FormData
        });
        if (!uploadRes.ok) throw new Error('Failed to upload attachments');
        uploadedFiles = await uploadRes.json(); // Expect array of filenames/URLs
      }
      // Update issue
      const res = await fetchWithAuth(`/api/issues/${issue.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          description,
          status,
          assignee,
          visibility: privacy ? 'Private' : 'Public',
          attachments: [...attachments, ...uploadedFiles],
        }),
      });
      if (!res.ok) throw new Error('Failed to update issue');
      setAttachments(prev => [...prev, ...uploadedFiles]);
      setNewFiles([]);
      setEditMode(false);
      notify({ message: 'Ticket updated!', type: 'success' });
    } catch (err: any) {
      setValidationErrors({ save: err.message || 'Failed to save changes.' });
      notify({ message: err.message || 'Failed to save changes.', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      const res = await fetchWithAuth(`/api/issues/${issue.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      notify({ message: 'Status updated!', type: 'success' });
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
      notify({ message: err.message || 'Failed to update status', type: 'error' });
    }
  }

  async function handleAssigneeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newAssignee = e.target.value;
    setAssignee(newAssignee);
    try {
      const res = await fetchWithAuth(`/api/issues/${issue.id}`, {
        method: 'PUT',
        body: JSON.stringify({ assignee: newAssignee }),
      });
      if (!res.ok) throw new Error('Failed to update assignee');
      notify({ message: 'Assignee updated!', type: 'success' });
    } catch (err: any) {
      setError(err.message || 'Failed to update assignee');
      notify({ message: err.message || 'Failed to update assignee', type: 'error' });
    }
  }

  function handleEdit() {
    setEditMode(true);
  }

  function handleCancelEdit() {
    setEditMode(false);
    setTitle(issue.title);
    setDescription(issue.description);
    setPrivacy(issue.visibility === 'Private');
    setAttachments(issue.attachments || []);
  }

  function handleCloseReopen() {
    setStatus(status === 'Closed' ? 'Open' : 'Closed');
  }

  function handlePrivacyToggle() {
    setPrivacy((p) => !p);
  }

  function handleAttachmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const valid = validateFiles(files);
      if (!valid.ok) {
        setFileError(valid.error ?? null);
        return;
      }
      setFileError(null);
      setNewFiles(prev => [...prev, ...files]);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const valid = validateFiles(files);
      if (!valid.ok) {
        setFileError(valid.error ?? null);
        return;
      }
      setFileError(null);
      setNewFiles(prev => [...prev, ...files]);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
  }

  function validateFiles(files: File[]): { ok: boolean; error?: string } {
    const allowedTypes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf',
      'video/mp4', 'video/quicktime', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return { ok: false, error: `File type not allowed: ${file.name}` };
      }
      if (file.size > maxSize) {
        return { ok: false, error: `File too large (max 5MB): ${file.name}` };
      }
    }
    return { ok: true };
  }

  function handleRemoveFile(idx: number) {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`/api/issues/${issue.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: commentInput }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      setCommentInput("");
      // Refresh comments
      const cres = await fetchWithAuth(`/api/issues/${issue.id}/comments`);
      if (cres.ok) {
        setComments(await cres.json());
      }
      notify({ message: 'Comment added!', type: 'success' });
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
      notify({ message: err.message || 'Failed to add comment', type: 'error' });
    } finally {
      setCommentLoading(false);
    }
  }

  if (!issue) return null;
  if (loading) return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center text-lg font-semibold">Loading issue details...</div>
    </div>
  );
  if (error) return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center text-lg text-red-600 font-semibold">{error}</div>
    </div>
  );

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="issue-detail-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-4xl mx-auto relative animate-fade-in max-h-[90vh] overflow-y-auto p-0 flex flex-col md:flex-row"
      >
        {/* Left: Main Details */}
        <div className="flex-1 px-8 py-8 flex flex-col gap-8 xs:px-2 xs:py-4 xs:gap-4 border-r border-gray-100 md:min-w-[340px]">
        {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={`inline-block w-3 h-3 rounded-full ${status === 'Open' ? 'bg-red-500' : status === 'In Progress' ? 'bg-yellow-400' : status === 'Resolved' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <h2 id="issue-detail-modal-title" className="text-2xl font-extrabold tracking-tight xs:text-lg">{title}</h2>
              <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-500">ID: {issue.id}</span>
            </div>
          <button
            type="button"
              className="text-gray-400 hover:text-red-500 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition absolute right-6 top-5 shadow-lg xs:w-8 xs:h-8 xs:text-lg xs:right-2 xs:top-2"
            onClick={onClose}
            aria-label="Close"
            ref={closeButtonRef}
          >
            &times;
          </button>
        </div>
          {/* Status, Priority, Assignee, Date */}
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className={`px-4 py-1 rounded-full text-xs font-semibold border ${status === 'Open' ? 'bg-red-50 text-red-700 border-red-200' : status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{status}</span>
            <span className={`px-4 py-1 rounded-full text-xs font-semibold border ${issue.priority === 'critical' ? 'bg-pink-50 text-pink-700 border-pink-200' : issue.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' : issue.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{issue.priority?.charAt(0).toUpperCase() + issue.priority?.slice(1)}</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" /><path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>{issue.date}</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>{assignee}</span>
            <span className={`px-4 py-1 rounded-full text-xs font-semibold border ${privacy ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{privacy ? 'Private' : 'Public'}</span>
            </div>
          {/* Description */}
          <div className="mb-4">
            <div className="font-semibold mb-1 text-gray-800 xs:text-sm">Description:</div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base xs:text-sm whitespace-pre-line min-h-[60px]">{description}</div>
          </div>
          {/* Attachments */}
          <div>
            <div className="font-semibold mb-2 text-gray-800 xs:text-sm xs:mb-1">Attachments:</div>
            {attachments && attachments.length > 0 ? (
              <div className="flex gap-3 flex-wrap xs:gap-1">
                {attachments.map((file: string, idx: number) => (
                  <span key={idx} className="block w-28 h-10 border border-gray-200 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-xs text-gray-500 truncate shadow-sm xs:w-20 xs:h-8 xs:text-[10px]">{file}</span>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm xs:text-xs">None</div>
            )}
          </div>
        </div>
        {/* Right: Comments & History */}
        <div className="flex-1 px-8 py-8 flex flex-col gap-8 xs:px-2 xs:py-4 xs:gap-4 bg-gray-50 rounded-r-3xl min-w-[320px]">
          {/* Comments */}
          <div>
            <div className="font-semibold mb-2 text-gray-800 xs:text-sm xs:mb-1">Comments:</div>
            <div className="flex flex-col gap-3 mb-2 xs:gap-1 xs:mb-1">
              {comments.map((c, idx) => (
                <div key={c.id || idx} className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm shadow-sm flex items-start gap-3 xs:px-2 xs:py-2 xs:text-xs xs:gap-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 xs:w-6 xs:h-6 xs:text-xs">{c.author?.[0]?.toUpperCase() || '?'}</div>
                  <div>
                    <div className="font-semibold text-blue-700 xs:text-xs">{c.author}</div>
                    <div className="text-gray-400 text-xs xs:text-[10px]">{c.date}</div>
                    <div className="text-gray-700 xs:text-xs mt-1">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <form className="flex gap-3 mt-2 xs:gap-1 xs:mt-1" onSubmit={handleCommentSubmit}>
              <input type="text" placeholder="Add a comment..." value={commentInput} onChange={e => setCommentInput(e.target.value)} className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm xs:px-2 xs:py-2 xs:text-xs" aria-label="Add a comment" />
              <button type="submit" disabled={commentLoading} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow xs:px-3 xs:py-2 xs:text-xs">
                {commentLoading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
          {/* Status History */}
          <div>
            <div className="font-semibold mb-2 text-gray-800 xs:text-sm xs:mb-1">Status History:</div>
            <ul className="relative pl-6 text-sm text-gray-600 xs:pl-3 xs:text-xs">
              {history.map((h, idx) => (
                <li key={h.id || idx} className="mb-3 flex items-start gap-2 relative xs:mb-1 xs:gap-1">
                  <span className="absolute left-0 top-1 w-3 h-3 rounded-full bg-blue-400 xs:w-2 xs:h-2"></span>
                  <span className="ml-4 xs:ml-2">{h.date}: <span className="font-semibold">{h.status}</span> by {h.by}</span>
                  {idx < history.length - 1 && <span className="absolute left-1.5 top-4 w-0.5 h-6 bg-blue-200 xs:left-1 xs:top-3 xs:h-4"></span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
} 