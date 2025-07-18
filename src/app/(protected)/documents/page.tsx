'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/primitives/card';
import { useDocuments } from '@/hooks/api/use-documents';
import { Button } from '@/components/ui/primitives/button';
import { ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { DocumentCard } from '@/components/ui/primitives/document-card';
import { DocumentFilters } from '@/components/ui/primitives/document-filters';
import { sampleDocuments } from '@/services/api/data';

export default function DocumentPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
  };

  return (
    <div className="p-6">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="h-auto min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-[0_15px_40px_rgb(46,76,238,0.12)] mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Document Library</h2>
            <p className="text-sm sm:text-base text-slate-100 font-normal max-w-[280px] sm:max-w-none">Access and manage important documents and resources in one place.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="bg-white/10 text-white hover:bg-white/20 border-white/20"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>

        <div className="mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.08)]"
            />
          </div>
        </div>

        <div className="mb-6">
          <DocumentFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <div className="space-y-4">
          {sampleDocuments.map((doc, index) => (
            <DocumentCard
              key={index}
              {...doc}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 