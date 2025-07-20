'use client';

import { useState } from 'react';
import { useDocuments } from '@/hooks/api/use-documents';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { DocumentCard } from '@/components/ui/primitives/document-card';
import { DocumentFilters } from '@/components/ui/primitives/document-filters';

// Helper to get file extension
const getFileType = (path: string): string => {
  const parts = path.split('.');
  if (parts.length < 2) return 'DOC';
  return parts.pop()!.toUpperCase();
};

// Map category name to badge type (fallback to 'Administrative')
const mapCategoryToBadge = (name: string): 'Important' | 'Events' | 'Administrative' => {
  const normalized = name.toLowerCase();
  if (normalized.includes('important')) return 'Important';
  if (normalized.includes('event')) return 'Events';
  return 'Administrative';
};

export default function DocumentPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, loading, error, refetch } = useDocuments();

  // Transform backend summary to DocumentCard props
  const transformedDocs = (documents as any[]).map((d) => {
    const fileType = getFileType(d.latestFilePath || '');
    return {
      title: d.title,
      postedDate: format(new Date(d.uploadedAt), 'dd/MM/yyyy'),
      fileType,
      updatedDate: format(new Date(d.updatedAt), 'dd/MM/yyyy'),
      tags: (d.tags || []).map((t: any) => t.name),
      badgeType: mapCategoryToBadge(d.category?.name || ''),
    };
  });

  // Filtering by search and active filter (tag/category)
  const filteredDocs = transformedDocs.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    // Filter by badgeType or tag name
    if (['Academic', 'Events', 'Administrative', 'Important'].includes(activeFilter)) {
      return matchesSearch && (doc.badgeType === activeFilter || doc.tags.includes(activeFilter));
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-[#161616] flex flex-col items-center py-0">
      <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto">
        <div className="h-auto min-h-[120px] sm:min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-8 lg:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-md mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Documents</h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-100 font-normal">Access and manage all your documents in one place.</p>
          </div>
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
        <div className="space-y-4 bg-blue-50 dark:bg-[#161616] p-6 rounded-xl min-h-[200px]">
          {loading && <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && filteredDocs.length === 0 && <p className="text-center text-gray-600 dark:text-gray-300">No documents found.</p>}
          {filteredDocs.map((doc, idx) => (
            <DocumentCard key={idx} {...doc} />
          ))}
        </div>
      </div>
    </div>
  );
} 