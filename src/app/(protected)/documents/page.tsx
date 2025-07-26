'use client';

import { useState, useMemo } from 'react';
import { useDocuments } from '@/hooks/api/use-documents';
import { format } from 'date-fns';
import { DocumentCard } from '@/components/features/document/document-card';
import { DocumentFilters } from '@/components/features/document/document-filters';
import { ChatPopup } from '@/components/features/chat/chat-popup';
// Removed useCategories hook – derive categories directly from documents

const SearchIcon = ({ className }: { className?: string }) => (
  <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.7129 20.6035C21.082 21.0137 21.082 21.6289 20.6719 21.998L19.5234 23.1465C19.1543 23.5566 18.5391 23.5566 18.1289 23.1465L14.0684 19.0859C13.8633 18.8809 13.7812 18.6348 13.7812 18.3887V17.6914C12.3047 18.8398 10.5 19.4961 8.53125 19.4961C3.81445 19.4961 0 15.6816 0 10.9648C0 6.28906 3.81445 2.43359 8.53125 2.43359C13.207 2.43359 17.0625 6.28906 17.0625 10.9648C17.0625 12.9746 16.3652 14.7793 15.2578 16.2148H15.9141C16.1602 16.2148 16.4062 16.3379 16.6113 16.502L20.7129 20.6035ZM8.53125 16.2148C11.4023 16.2148 13.7812 13.877 13.7812 10.9648C13.7812 8.09375 11.4023 5.71484 8.53125 5.71484C5.61914 5.71484 3.28125 8.09375 3.28125 10.9648C3.28125 13.877 5.61914 16.2148 8.53125 16.2148Z" fill="#8A8A8A"/>
  </svg>
);

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { documents, loading: docsLoading, error: docsError, refetch } = useDocuments();
  // Transform documents into view model
  const transformedDocs = useMemo(() => {
    return (documents as any[]).map((d) => {
      const fileType = getFileType(d.latestFilePath || '');

      // Safely extract tags
      const tags = d.tags ? (d.tags as any[]).map((t) => t?.name || t).filter(Boolean) : [];

      return {
        title: d.title,
        postedDate: format(new Date(d.uploadedAt), 'dd/MM/yyyy'),
        fileType,
        updatedDate: format(new Date(d.updatedAt), 'dd/MM/yyyy'),
        tags,
        categoryName: d.category?.name || '',
        badgeType: mapCategoryToBadge(d.category?.name || ''),
        uploadedBy: d.uploadedBy || 'Admin',
        fileUrl: d.latestFilePath || d.fileUrl,
        updatedAtTimestamp: new Date(d.updatedAt).getTime(),
      };
    });
  }, [documents]);

  // Derive categories with document counts from transformedDocs
  const activeCategories = useMemo(() => {
    const stats = new Map<string, number>();
    transformedDocs.forEach((doc: any) => {
      if (doc.categoryName) {
        stats.set(doc.categoryName, (stats.get(doc.categoryName) || 0) + 1);
      }
    });
    return Array.from(stats.entries())
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
      .map(([name]) => name);
  }, [transformedDocs]);

  // Get top 5 categories and rest as "Others"
  const displayCategories = useMemo(() => {
    const top5 = activeCategories.slice(0, 5);
    return activeCategories.length > 5 ? [...top5, 'Others'] : top5;
  }, [activeCategories]);

  // Filter documents based on selected categories and search
  const filteredDocs = useMemo(() => {
    return transformedDocs
      .filter((doc: any) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (selectedCategories.length === 0) {
          if (activeFilter === 'All') return matchesSearch;
          if (activeFilter === 'Others') {
            return matchesSearch && !displayCategories.slice(0, -1).includes(doc.categoryName);
          }
          return matchesSearch && doc.categoryName === activeFilter;
        }
        return matchesSearch && selectedCategories.includes(doc.categoryName);
      })
      .sort((a: any, b: any) => {
        return sortOrder === 'desc' 
          ? b.updatedAtTimestamp - a.updatedAtTimestamp
          : a.updatedAtTimestamp - b.updatedAtTimestamp;
      });
  }, [transformedDocs, searchQuery, activeFilter, selectedCategories, sortOrder, displayCategories]);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const loading = docsLoading;
  const error = docsError;

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
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto mt-6 mb-3">
        <DocumentFilters
          categories={displayCategories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          allCategories={activeCategories}
          selectedCategories={selectedCategories}
          onSelectedCategoriesChange={setSelectedCategories}
          sortOrder={sortOrder}
          onSortToggle={handleSortToggle}
        />
      </div>

      <div className="w-full max-w-[95%] xl:max-w-[1400px] px-2 sm:px-4 lg:px-8 mx-auto mb-12">
        <div className="space-y-4 overflow-y-auto bg-blue-50 dark:bg-[#161616] rounded-xl">
          {loading && <p className="text-center text-gray-600 dark:text-gray-300 py-6">Loading...</p>}
          {error && <p className="text-center text-red-500 py-6">{error}</p>}
          {!loading && filteredDocs.length === 0 && <p className="text-center text-gray-600 dark:text-gray-300 py-6">No documents found.</p>}
          <div className="space-y-4">
            {filteredDocs.map((doc: any, idx: number) => (
              <DocumentCard key={idx} {...doc} />
            ))}
          </div>
        </div>
      </div>
      <ChatPopup />
    </div>
  );
} 