import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UploadArrowIcon } from '@/components/ui/icons/upload-arrow-icon';
import { Modal } from '@/components/ui/primitives/modal';
import type { Category, Tag } from '@/hooks/api/use-document-admin';

interface CreateDocumentFormProps {
  onClose: () => void;
  onCreate: (data: { title: string; categoryId: number; tagIds: number[]; file: File; allowedUsers: string[] }) => void;
  onCreateCategory: (name: string) => Promise<boolean>;
  onCreateTag: (name: string) => Promise<boolean>;
  categories: Category[];
  tags: Tag[];
  loadingCategories?: boolean;
  loadingTags?: boolean;
}

export function CreateDocumentForm({
  onClose,
  onCreate,
  onCreateCategory,
  onCreateTag,
  categories,
  tags,
}: CreateDocumentFormProps) {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const fallbackCategories = [
    { id: -1, name: 'All' },
    { id: -2, name: 'Academic' },
    { id: -3, name: 'Events' },
    { id: -4, name: 'Administrative' },
    { id: -5, name: 'Important' }
  ];
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number | ''>('');
  const [newTag, setNewTag] = useState('');
  const [showNewTag, setShowNewTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const userRoles = ['ALL', 'STUDENT', 'SUPER_ADMIN', 'ADMIN', 'BATCH2023'];
  const userBatches = ['BATCH2024', 'BATCH2025', 'BATCH2026', 'BATCH2027', 'BATCH2028'];
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async () => {
    if (!title || !selectedCategory || !file) {
      alert('Title, category and file are required');
      return;
    }
    onCreate({
      title,
      categoryId: Number(selectedCategory),
      tagIds: selectedTags,
      file,
      allowedUsers,
    });
  };

  const toggleTag = (id: number) => {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const toggleAllowedUser = (val: string) => {
    setAllowedUsers((prev) => {
      // Selecting ALL clears others; selecting others when ALL selected does nothing
      if (val === 'ALL') {
        return prev.includes('ALL') ? [] : ['ALL'];
      }
      if (prev.includes('ALL')) {
        return prev; // ignore other selections when ALL active
      }
      return prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val];
    });
  };

  return (
    <Modal id="create-document" isOpen={true} onClose={onClose} className="w-full max-w-xl flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="bg-[#2237EC] p-4 rounded-t-xl flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-white">Create New Document</h2>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 space-y-6 overflow-y-auto flex-grow">
        {/* Document Title */}
        <div className="space-y-1">
          <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Document Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Document Title"
            className="w-full p-2.5 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Upload File */}
        <div className="space-y-1">
          <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Upload File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 h-28 flex flex-col justify-center items-center text-center cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
            {file ? (
              <p className="text-gray-700">Selected: {file.name}</p>
            ) : (
              <div className="flex flex-col items-center">
                <UploadArrowIcon className="w-6 h-6 mb-2" />
                <p className="text-gray-600 mb-1 text-sm text-center">Drag and drop images here or click to browse</p>
                <p className="text-xs text-gray-500">Supported Formats: PDF, DOC, DOCX, TXT</p>
              </div>
            )}
            <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900">
            <option value="">Select Category</option>
            {(categories.length ? categories : fallbackCategories).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button type="button" className="text-[#1A85FF] text-xs font-opensans font-bold leading-none hover:underline" onClick={() => setShowNewCategory(!showNewCategory)}>
            + Add New Category
          </button>

          {showNewCategory && (
            <div className="flex gap-2 mt-2">
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category name" className="flex-1 p-2 border border-gray-200 rounded-lg" />
              <button type="button" onClick={async () => { if(await onCreateCategory(newCategory)){ setNewCategory(''); setShowNewCategory(false);} }} className="px-4 py-1 bg-[#2237EC] text-white text-xs font-medium rounded">Add</button>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Tags</label>
          <div className="space-y-2">
            <select
              value={selectedTagId}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  const idNum = Number(val);
                  if (!selectedTags.includes(idNum)) setSelectedTags([...selectedTags, idNum]);
                  setSelectedTagId('');
                }
              }}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white"
            >
              <option value="">Select a tag</option>
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button type="button" className="text-[#1A85FF] text-xs font-opensans font-bold leading-none hover:underline" onClick={() => setShowNewTag(!showNewTag)}>+ Add New Tag</button>

            {showNewTag && (
              <div className="flex gap-2 mt-2">
                <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Tag name" className="flex-1 p-2 border border-gray-200 rounded-lg" />
                <button type="button" onClick={async () => { if(await onCreateTag(newTag)){ setNewTag(''); setShowNewTag(false);} }} className="px-4 py-1 bg-[#2237EC] text-white text-xs font-medium rounded">Add</button>
              </div>
            )}

            {/* Selected tags chips */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedTags.map((id) => {
                  const tag = tags.find((t) => t.id === id);
                  if (!tag) return null;
                  return (
                    <span key={id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {tag.name}
                      <button type="button" onClick={() => toggleTag(id)} className="text-blue-700 hover:text-blue-900">
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Allowed Users */}
        <div className="mt-4">
          <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900 mb-2">Allowed Users</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 mb-2">
            {[...userRoles, ...userBatches].map((val) => {
              const checked = allowedUsers.includes(val);
              const allSelected = allowedUsers.includes('ALL');
              const isDisabled = (val !== 'ALL' && allSelected) || (val === 'ALL' && allowedUsers.length > 0 && !checked);
              return (
                <label key={val} className={"cursor-pointer " + (isDisabled ? 'opacity-40 pointer-events-none' : '')}>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    disabled={isDisabled}
                    onChange={() => toggleAllowedUser(val)}
                  />
                  <span className={`inline-block w-full text-center px-2 py-1 rounded-md border border-gray-300 text-[13px] leading-5 font-medium font-opensans transition-colors ${checked ? 'bg-blue-600 text-white' : ''}` }>
                    {val.replace('_',' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-4 flex justify-end gap-3 flex-shrink-0">
        <button onClick={onClose} className="px-5 py-2 bg-gray-200 rounded-lg">Cancel</button>
        <button onClick={handleSubmit} className="px-6 py-2.5 rounded-lg font-opensans font-semibold text-white" style={{background:'linear-gradient(90.57deg,#628EFF 9.91%,#8740CD 53.29%,#580475 91.56%)'}}>
          Create
        </button>
      </div>
    </Modal>
  );
} 