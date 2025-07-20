import { useState } from 'react';
import { UploadArrowIcon } from '@/components/ui/icons/upload-arrow-icon';
import type { Category, Tag } from '@/hooks/api/use-document-admin';
import { Modal } from '@/components/ui/primitives/modal';

interface EditDocumentFormProps {
  onClose: () => void;
  onUpdate: (data: {categoryId:number; tagIds:number[]; file?:File; allowedUsers:string[]})=>void;
  categories: Category[];
  tags: Tag[];
  onCreateCategory: (name:string)=>Promise<boolean>;
  onCreateTag:(name:string)=>Promise<boolean>;
  initial: {
    categoryId:number;
    tagIds:number[];
    allowedUsers:string[];
  };
}

export function EditDocumentForm({onClose,onUpdate,categories,tags,onCreateCategory,onCreateTag,initial}:EditDocumentFormProps){
  const [selectedCategory,setSelectedCategory]=useState<number|''>(initial.categoryId||'');
  const [selectedTags,setSelectedTags]=useState<number[]>(initial.tagIds||[]);
  const [file,setFile]=useState<File|undefined>();
  const [allowedUsers,setAllowedUsers]=useState<string[]>(initial.allowedUsers||[]);
  const [showNewCategory,setShowNewCategory]=useState(false);
  const [newCategory,setNewCategory]=useState('');
  const [showNewTag,setShowNewTag]=useState(false);
  const [newTag,setNewTag]=useState('');

  const fallbackCategories=[
    {id:-1,name:'All'},
    {id:-2,name:'Academic'},
    {id:-3,name:'Events'},
    {id:-4,name:'Administrative'},
    {id:-5,name:'Important'}
  ];
  const allValues=[...new Set(['ALL','STUDENT','SUPER_ADMIN','ADMIN','BATCH2023','BATCH2024','BATCH2025','BATCH2026','BATCH2027','BATCH2028'])];
  const toggleAllowed=(v:string)=>{ if(v==='ALL'){setAllowedUsers(prev=>prev.includes('ALL')?[]:['ALL']);}else{ if(allowedUsers.includes('ALL'))return; setAllowedUsers(prev=>prev.includes(v)?prev.filter(x=>x!==v):[...prev,v]);}}
  const toggleTag=(id:number)=>{ setSelectedTags(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); };
  return (
    <Modal id="edit-document" isOpen={true} onClose={onClose} className="w-full max-w-xl flex flex-col max-h-[90vh]">
    <div className="bg-[#2237EC] p-4 rounded-t-xl flex items-center justify-between flex-shrink-0">
      <h2 className="text-xl font-bold text-white">Edit Document</h2>
      <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">✕</button>
    </div>
    <div className="p-6 space-y-4 overflow-y-auto flex-grow">
      {/* Upload */}
      <div className="space-y-1">
        <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Upload File</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 h-28 flex flex-col justify-center items-center text-center cursor-pointer" onClick={()=>document.getElementById('fileInputEdit')?.click()}>
          {file? <p>{file.name}</p> : (<><UploadArrowIcon className="w-6 h-6 mb-1"/><p className="text-gray-600 mb-1 text-sm">Drag and drop images here or click to browse</p><p className="text-xs text-gray-500">Supported Formats: PDF, DOC, DOCX, TXT</p></>)}
          <input id="fileInputEdit" type="file" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)setFile(f);}}/>
        </div>
      </div>
      {/* Category */}
      <div className="space-y-1">
        <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Category</label>
        <select value={selectedCategory} onChange={e=>setSelectedCategory(Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900">
          {(categories.length?categories:fallbackCategories).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="button" className="text-[#1A85FF] text-xs font-opensans font-bold leading-none hover:underline" onClick={()=>setShowNewCategory(!showNewCategory)}>+ Add New Category</button>
        {showNewCategory && (
          <div className="flex gap-2 mt-2">
            <input value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder="Category name" className="flex-1 p-2 border border-gray-300 rounded-lg"/>
            <button type="button" onClick={async()=>{if(await onCreateCategory(newCategory)){setNewCategory('');setShowNewCategory(false);}}} className="px-4 py-1 bg-[#2237EC] text-white text-xs font-medium rounded">Add</button>
          </div>) }
      </div>
      {/* Tags */}
      <div className="space-y-1">
        <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900">Tags</label>
        <div className="space-y-1">
          <select onChange={e=>{const val=Number(e.target.value);if(val&&!selectedTags.includes(val)) setSelectedTags([...selectedTags,val]);}} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900">
            <option value="">Select a tag</option>
            {tags.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button type="button" className="text-[#1A85FF] text-xs font-opensans font-bold leading-none hover:underline" onClick={()=>setShowNewTag(!showNewTag)}>+ Add New Tag</button>
          {showNewTag && (<div className="flex gap-2 mt-2"><input value={newTag} onChange={e=>setNewTag(e.target.value)} placeholder="Tag name" className="flex-1 p-2 border border-gray-300 rounded-lg"/><button type="button" onClick={async()=>{if(await onCreateTag(newTag)){setNewTag('');setShowNewTag(false);}}} className="px-4 py-1 bg-[#2237EC] text-white text-xs font-medium rounded">Add</button></div>)}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map(id=>{const tag=tags.find(t=>t.id===id); if(!tag) return null; return <span key={id} className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">{tag.name} <button onClick={()=>toggleTag(id)}>×</button></span>;})}
          </div>
        </div>
      </div>
      {/* Allowed Users */}
      <div>
        <label className="block font-opensans font-bold text-[16px] leading-none text-gray-900 mb-2">Allowed Users</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {allValues.map(v=>{const checked=allowedUsers.includes(v);const disabled=(allowedUsers.includes('ALL')&&v!=='ALL')||(v==='ALL'&&allowedUsers.length&&v!=='ALL');return <label key={v} className={`cursor-pointer ${disabled?'opacity-40 pointer-events-none':''}`}><input type="checkbox" className="sr-only" checked={checked} disabled={disabled} onChange={()=>toggleAllowed(v)}/><span className={`inline-block w-full text-center px-2 py-1 rounded-md border text-[13px] font-opensans ${checked?'bg-blue-600 text-white':''}`}>{v}</span></label>})}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button onClick={onClose} className="px-5 py-2 bg-gray-200 rounded">Cancel</button>
        <button onClick={()=>onUpdate({categoryId:Number(selectedCategory),tagIds:selectedTags,file,allowedUsers})} className="px-6 py-2.5 rounded text-white" style={{background:'linear-gradient(90.57deg,#628EFF 9.91%,#8740CD 53.29%,#580475 91.56%)'}}>Update</button>
      </div>
    </div>
    </Modal>
  );
} 