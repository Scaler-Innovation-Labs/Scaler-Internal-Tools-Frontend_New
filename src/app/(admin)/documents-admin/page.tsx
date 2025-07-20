'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/primitives/button';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DocumentFilters } from '@/components/ui/primitives/document-filters';
import { AdminDocumentCard } from '@/components/ui/primitives/admin-document-card';
import { CreateDocumentForm } from '@/components/ui/primitives/create-document-form';
import { useDocuments } from '@/hooks/api/use-documents';
import { useDocumentAdmin } from '@/hooks/api/use-document-admin';
import { EditDocumentForm } from '@/components/ui/primitives/edit-document-form';
import React, { useEffect } from 'react';
import { format } from 'date-fns';

const getFileType = (path: string): string => {
  const parts = path.split('.');
  if (parts.length < 2) return 'DOC';
  return parts.pop()!.toUpperCase();
};

const mapCategoryToBadge = (name: string): 'Important' | 'Events' | 'Administrative' => {
  const normalized = name.toLowerCase();
  if (normalized.includes('important')) return 'Important';
  if (normalized.includes('event')) return 'Events';
  return 'Administrative';
};

export default function DocumentAdminPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { documents, loading, error, refetch } = useDocuments({ isAdmin: true });
  const { categories, tags, fetchCategories, fetchTags, createDocument, createCategory, createTag, updateDocument, deleteDocument } = useDocumentAdmin();
  const [editDocId,setEditDocId]=useState<number|null>(null);
  const [editInitial,setEditInitial]=useState<any>(null);

  // Fetch categories and tags on mount
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  const transformedDocs = (documents as any[]).map((d) => {
    const fileType = getFileType(d.latestFilePath || '');
    return {
      title: d.title,
      postedDate: format(new Date(d.uploadedAt), 'dd/MM/yyyy'),
      updatedDate: format(new Date(d.updatedAt), 'dd/MM/yyyy'),
      fileType,
      tags: (d.tags || []).map((t: any) => t.name),
      badgeType: mapCategoryToBadge(d.category?.name || ''),
      uploadedBy: d.uploadedBy || 'Admin',
      versions: [],
      id:d.id,
    };
  });

  const filteredDocs = transformedDocs.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && (doc.badgeType === activeFilter || doc.tags.includes(activeFilter));
  });

  const handleEdit=(id:number)=>{
    const doc=(documents as any[]).find((x)=>x.id===id);
    if(!doc) return;
    setEditDocId(id);
    setEditInitial({categoryId:doc.category?.id||'',tagIds:(doc.tags||[]).map((t:any)=>t.id),allowedUsers:doc.allowedUsers||[]});
  };

  const handleDelete=async(id:number)=>{
    if(!confirm('Are you sure you want to delete this document?')) return;
    const ok=await deleteDocument(id);
    if(ok) refetch();
    else alert('Failed to delete');
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex flex-col items-center py-0">
      <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto">
        <div className="h-auto min-h-[120px] sm:min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-8 lg:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-md mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Documents</h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-100 font-normal">Access and manage all your documents in one place.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 border-white"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="ml-2">Create Document</span>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto my-6">
        <DocumentFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto mb-12">
        <div className="space-y-4 overflow-y-auto pr-2 bg-blue-50 dark:bg-[#161616] p-6 rounded-xl">
          {loading && <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && filteredDocs.length === 0 && <p className="text-center text-gray-600 dark:text-gray-300">No documents found.</p>}
          {filteredDocs.map((doc, idx) => (
            <AdminDocumentCard key={idx} {...doc} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateDocumentForm
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            const success = await createDocument(data);
            if (success) {
              setShowCreateModal(false);
              refetch();
            } else {
              alert('Failed to create document');
            }
          }}
          categories={categories}
          tags={tags}
          onCreateCategory={createCategory}
          onCreateTag={createTag}
        />
      )}

      {editDocId!==null && editInitial && (
        <EditDocumentForm
          onClose={()=>{setEditDocId(null);setEditInitial(null);}}
          onUpdate={async(data)=>{const ok=await updateDocument(editDocId!,data);if(ok){setEditDocId(null);setEditInitial(null);refetch();}}}
          categories={categories}
          tags={tags}
          initial={editInitial}
        />
      )}
    </div>
  );
} 