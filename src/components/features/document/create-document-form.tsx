import { useState, useMemo, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UploadArrowIcon } from '@/components/ui/icons/upload-arrow-icon';
import { Modal } from '@/components/ui/primitives/modal';
import type { Category, Tag } from '@/hooks/api/use-document-admin';

interface CreateDocumentFormProps {
  onClose: () => void;
  onCreate: (data: { title: string; categoryId: number; tagIds: number[]; file: File; allowedUsers: string[] }) => void;
  onCreateCategory: (name: string) => Promise<boolean>;
  onCreateTag: (name: string) => Promise<boolean>;
  onDeleteCategory: (id:number) => Promise<boolean>;
  onDeleteTag:(id:number)=>Promise<boolean>;
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
  onDeleteCategory,
  onDeleteTag,
  categories,
  tags,
}: CreateDocumentFormProps) {
  const [title, setTitle] = useState('');
  // Category related state
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  // helper state to allow live-search inside an <input list="…" /> element
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryOptions,setShowCategoryOptions]=useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  // Tag selection helpers
  const [tagInput, setTagInput] = useState('');
  const [showTagOptions,setShowTagOptions]=useState(false);
  const [newTag, setNewTag] = useState('');
  const [showNewTag, setShowNewTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  // local validation errors
  const [errors, setErrors] = useState<{ title?: string; category?: string; file?: string; users?: string }>({});
  const userRoles = ['ALL', 'STUDENT', 'SUPER_ADMIN', 'ADMIN', 'BATCH2023'];
  const userBatches = ['BATCH2024', 'BATCH2025', 'BATCH2026', 'BATCH2027', 'BATCH2028'];
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  const [isDragOver,setIsDragOver]=useState(false);

  // remember name of category being created so we can auto-select once list updates
  const pendingCategoryName = useRef<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async () => {
    const newErrors: { title?: string; category?: string; file?: string; users?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!selectedCategory) newErrors.category = 'Category is required';
    if (!file) newErrors.file = 'File is required';
    if (allowedUsers.length===0) newErrors.users='Select at least one user';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onCreate({
      title,
      categoryId: Number(selectedCategory),
      tagIds: selectedTags,
      file: file as File,
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

  const filteredCategories = useMemo(() => {
    const input = categoryInput.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(input));
  }, [categoryInput, categories]);

  // Suggestions while typing in the add-new-category input
  const filteredNewCategory = useMemo(() => {
    const input = newCategory.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(input));
  }, [newCategory, categories]);

  const filteredTags = useMemo(() => {
    const input = tagInput.toLowerCase();
    return tags.filter(t => t.name.toLowerCase().includes(input) && !selectedTags.includes(t.id));
  }, [tagInput, tags, selectedTags]);

  const filteredNewTag = useMemo(() => {
    const input = newTag.toLowerCase();
    return tags.filter(t => t.name.toLowerCase().includes(input));
  }, [newTag, tags]);

  // effect to auto-select category after categories prop updates
  useEffect(() => {
    if (pendingCategoryName.current) {
      const cat = categories.find(c => c.name.toLowerCase() === pendingCategoryName.current);
      if (cat) {
        setSelectedCategory(cat.id);
        setCategoryInput(cat.name);
        pendingCategoryName.current = null;
      }
    }
  }, [categories]);

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
            className={`w-full p-2.5 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Upload File */}
        <div className="space-y-1">
          <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Upload File</label>
          <div
            className={`border-2 border-dashed rounded-lg p-2 h-28 flex flex-col justify-center items-center text-center cursor-pointer ${errors.file ? 'border-red-500' : isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onClick={() => document.getElementById('fileInput')?.click()}
            onDragOver={(e)=>{e.preventDefault();setIsDragOver(true);}}
            onDragLeave={()=>setIsDragOver(false)}
            onDrop={(e)=>{e.preventDefault();setIsDragOver(false); if(e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);}}
          >
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
            {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Category</label>
          <div className="relative">
            <input
              value={categoryInput}
              onFocus={()=>setShowCategoryOptions(true)}
              onChange={(e)=>{const val=e.target.value;setCategoryInput(val);setShowCategoryOptions(true);}}
              onBlur={()=>setTimeout(()=>setShowCategoryOptions(false),150)}
              placeholder="Search category..."
              className={`w-full p-2.5 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'} bg-white text-gray-900`}
            />
            {showCategoryOptions && (
              <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 max-h-40 overflow-y-auto rounded shadow">
                {filteredCategories.length===0 && <li className="px-3 py-2 text-gray-500 text-sm">No matches</li>}
                {filteredCategories.map(c=> (
                  <li key={c.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-sm" onMouseDown={e=>e.stopPropagation()}>
                    <span className="cursor-pointer flex-1" onClick={()=>{setSelectedCategory(c.id);setCategoryInput(c.name);setShowCategoryOptions(false);}}>{c.name}</span>
                    <button type="button" className="ml-2" onClick={async()=>{await onDeleteCategory(c.id);}}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.25 3.75L3.75 10.25M3.75 3.75L10.25 10.25" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}

          <button type="button" className="text-[#1A85FF] text-xs font-opensans font-bold leading-none hover:underline" onClick={() => setShowNewCategory(!showNewCategory)}>
            + Add New Category
          </button>

          {showNewCategory && (
            <div className="relative mt-2">
              <div className="flex gap-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 p-2 border border-gray-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const trimmed = newCategory.trim();
                    if (!trimmed) return;
                    const existing = categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
                    if (existing) {
                      setSelectedCategory(existing.id);
                      setCategoryInput(existing.name);
                      setNewCategory('');
                      setShowNewCategory(false);
                      return;
                    }
                    if (await onCreateCategory(trimmed)) {
                      pendingCategoryName.current = trimmed.toLowerCase();
                      setNewCategory('');
                      setShowNewCategory(false);
                    }
                  }}
                  className="px-4 py-1 bg-[#2237EC] text-white text-xs font-medium rounded"
                >
                  Add
                </button>
              </div>
              {newCategory && (
                <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 max-h-32 overflow-y-auto rounded shadow mt-1">
                  {/* no "No matches" here as requested */}
                  {filteredNewCategory.map(c => (
                    <li key={c.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm" onMouseDown={() => {
                      setSelectedCategory(c.id);
                      setCategoryInput(c.name);
                      setNewCategory('');
                      setShowNewCategory(false);
                    }}>{c.name}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Tags</label>
          <div className="space-y-2">
            <div className="relative">
                <input
                  value={tagInput}
                  onFocus={()=>setShowTagOptions(true)}
                  onChange={(e)=>{setTagInput(e.target.value);setShowTagOptions(true);}}
                  onBlur={()=>setTimeout(()=>setShowTagOptions(false),150)}
                  placeholder="Search or select tag"
                  className="w-full p-2 border border-gray-200 rounded-lg"
                />
                {showTagOptions && (
                  <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 max-h-40 overflow-y-auto rounded shadow">
                    {filteredTags.length===0 && <li className="px-3 py-2 text-gray-500 text-sm">No matches</li>}
                    {filteredTags.map(t=> (
                      <li key={t.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-sm" onMouseDown={e=>e.stopPropagation()}>
                        <span className="cursor-pointer flex-1" onClick={()=>{setSelectedTags(prev=> prev.includes(t.id)?prev:[...prev,t.id]); setTagInput('');setShowTagOptions(false);}}>{t.name}</span>
                        <button type="button" className="ml-2" onClick={async()=>{await onDeleteTag(t.id);}}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.25 3.75L3.75 10.25M3.75 3.75L10.25 10.25" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            {/* suggestions handled by custom dropdown */}

            <button type="button" className="text-[#1A85FF] text-xs font-opensans font-bold leading-none hover:underline" onClick={() => setShowNewTag(!showNewTag)}>+ Add New Tag</button>

            {showNewTag && (
              <div className="relative mt-2">
                <div className="flex gap-2">
                  <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Tag name" className="flex-1 p-2 border border-gray-200 rounded-lg" />
                  <button type="button" onClick={async () => { const trimmed=newTag.trim(); if(!trimmed) return; if(await onCreateTag(trimmed)){ const newly=tags.find(t=>t.name.toLowerCase()===trimmed.toLowerCase()); if(newly && !selectedTags.includes(newly.id)) setSelectedTags([...selectedTags,newly.id]); setNewTag(''); setShowNewTag(false);} }} className="px-4 py-1 bg-[#2237EC] text-white text-xs font-medium rounded">Add</button>
                </div>
                {newTag && (
                  <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 max-h-32 overflow-y-auto rounded shadow mt-1">
                    {/* no "No matches" here */}
                    {filteredNewTag.map(t => (
                      <li key={t.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm" onMouseDown={() => {
                        if (!selectedTags.includes(t.id)) setSelectedTags([...selectedTags, t.id]);
                        setNewTag('');
                        setShowNewTag(false);
                      }}>{t.name}</li>
                    ))}
                  </ul>
                )}
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
          <div className={`grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 mb-2 ${errors.users ? 'border border-red-500 p-2 rounded' : ''}` }>
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
          {errors.users && <p className="text-red-500 text-xs mt-1">{errors.users}</p>}
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