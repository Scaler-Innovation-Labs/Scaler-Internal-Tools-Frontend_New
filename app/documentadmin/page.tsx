'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDocuments } from '@/hooks/use-documents';
import { ArrowPathIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DocumentFilters } from '@/components/ui/document-filters';
import { AdminDocumentCard } from '@/components/ui/admin-document-card';
import { CreateDocumentForm } from '@/components/ui/create-document-form';
import { sampleDocuments, formConfig } from '@/lib/data/document-samples';

export default function DocumentAdminPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
  };

  return (
    <div className="p-6">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="h-auto min-h-[140px] bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] px-4 sm:px-10 py-6 sm:py-7 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-[0_15px_40px_rgb(46,76,238,0.12)] mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Document Management</h2>
            <p className="text-sm sm:text-base text-slate-100 font-normal max-w-[280px] sm:max-w-none">Manage and organize documents, categories, and access permissions.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 border-white"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="ml-2">Create Document</span>
            </Button>
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

        <div className="space-y-4 overflow-y-auto pr-2">
          {sampleDocuments.map((doc, index) => (
            <AdminDocumentCard
              key={index}
              {...doc}
            />
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateDocumentForm
          onClose={() => setShowCreateModal(false)}
          {...formConfig}
        />
      )}
    </div>
  );
} 