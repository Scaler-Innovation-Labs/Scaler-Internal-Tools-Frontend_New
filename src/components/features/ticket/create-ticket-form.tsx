import React, { useState } from 'react';
import { Button } from '@/components/ui/primitives/button';
import type { TicketCreateData, CampusType, TicketPriority } from '@/types/features/tickets';

interface CreateTicketFormProps {
  onSubmit: (data: TicketCreateData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CreateTicketForm({ onSubmit, onCancel, loading = false }: CreateTicketFormProps) {
  const [formData, setFormData] = useState<Partial<TicketCreateData>>({
    title: '',
    description: '',
    priority: 'MEDIUM' as TicketPriority,
    campus: 'MICRO_CAMPUS' as CampusType,
    isPrivate: false,
    imageUrl: []
  });
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: keyof TicketCreateData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const handleRemoveFile = (name: string) => {
    setFiles(prev => prev.filter(file => file.name !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.priority || !formData.campus) {
      alert('Please fill in all required fields');
      return;
    }

    const ticketData: TicketCreateData = {
      title: formData.title!,
      description: formData.description!,
      priority: formData.priority!,
      campus: formData.campus!,
      isPrivate: formData.isPrivate || false,
      imageUrl: formData.imageUrl || []
    };

    await onSubmit(ticketData);
  };

  const shortenFileName = (name: string, maxLength = 16) => {
    if (name.length <= maxLength) return name;
    const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
    const base = name.replace(ext, '');
    return base.slice(0, maxLength - 3 - ext.length) + '...' + ext;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Issue Title *</label>
        <input 
          type="text" 
          value={formData.title || ''} 
          onChange={e => handleInputChange('title', e.target.value)} 
          placeholder="Enter a brief title for your issue" 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm" 
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Campus *</label>
          <select 
            value={formData.campus || ''} 
            onChange={e => handleInputChange('campus', e.target.value as CampusType)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm" 
            required
          >
            <option value="">Select a campus</option>
            <option value="MICRO_CAMPUS">Micro Campus</option>
            <option value="MACRO_CAMPUS">Macro Campus</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Priority *</label>
          <select 
            value={formData.priority || ''} 
            onChange={e => handleInputChange('priority', e.target.value as TicketPriority)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm" 
            required
          >
            <option value="">Select a priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
            <option value="BLOCKER">Blocker</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Detailed Description *</label>
        <textarea 
          value={formData.description || ''} 
          onChange={e => handleInputChange('description', e.target.value)} 
          placeholder="Describe your issue in detail....." 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm" 
          required 
        />
      </div>
      
      {/* Attachments */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Attachments</label>
        <div
          className={`border-2 border-dashed rounded-lg p-4 flex items-center gap-4 min-h-[120px] transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
          onClick={e => {
            if ((e.target as HTMLElement).closest('.remove-btn')) return;
            document.getElementById('file-upload-input')?.click();
          }}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
          onDrop={e => {
            e.preventDefault();
            setDragActive(false);
            const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            setFiles(prev => [...prev, ...droppedFiles]);
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload images"
          style={{ justifyContent: files.length === 0 ? 'center' : 'flex-start' }}
        >
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full">
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
                <rect x="4" y="16" width="16" height="4" rx="2" />
              </svg>
              <span className="text-gray-500">Drag and drop images here or click to browse</span>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap items-center">
              {files.map(file => (
                <div key={file.name} className="flex flex-col items-center relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, border: '1px solid #ddd' }}
                  />
                  <button
                    type="button"
                    className="remove-btn absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg opacity-90 hover:opacity-100 z-10"
                    onClick={e => { e.stopPropagation(); handleRemoveFile(file.name); }}
                    aria-label={`Remove ${file.name}`}
                  >
                    &times;
                  </button>
                  <span className="mt-2 text-xs text-gray-700 break-all text-center w-16">{shortenFileName(file.name)}</span>
                </div>
              ))}
            </div>
          )}
          <input
            id="file-upload-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Privacy Setting */}
      <div className="border border-blue-200 bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2l7 4v6c0 5.25-3.5 10-7 10s-7-4.75-7-10V6l7-4z" />
          </svg>
          <div>
            <div className="font-semibold text-gray-700 text-lg flex items-center gap-2">Privacy Setting</div>
            <div className="text-xs text-gray-500 mt-1">Only you have access to view your submitted reports and any responses from authorities.</div>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={formData.isPrivate || false}
            onChange={e => handleInputChange('isPrivate', e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-500 transition"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition peer-checked:translate-x-5"></div>
        </label>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#2E4CEE] to-[#221EBF] text-white hover:from-[#221EBF] hover:to-[#2E4CEE]"
        >
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </Button>
      </div>
    </form>
  );
} 