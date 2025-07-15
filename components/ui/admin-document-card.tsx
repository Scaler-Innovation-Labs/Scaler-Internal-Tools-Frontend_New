import { useState } from 'react';
import { DocumentIcon, PencilIcon, TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { VersionHistoryModal } from './version-history-modal';

interface AdminDocumentCardProps {
  title: string;
  postedDate: string;
  updatedDate: string;
  fileType: string;
  tags: string[];
  badgeType: 'Important' | 'Events' | 'Administrative';
  uploadedBy: string;
  fileSize?: string;
  versions?: Array<{
    title: string;
    updated: string;
    author: string;
    fileType: string;
    fileSize: string;
    access: string[];
    viewUrl: string;
  }>;
}

const badgeStyles = {
  Important: {
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  Events: {
    bg: 'bg-purple-50',
    text: 'text-purple-600'
  },
  Administrative: {
    bg: 'bg-green-50',
    text: 'text-green-600'
  }
};

export function AdminDocumentCard({
  title,
  postedDate,
  updatedDate,
  fileType,
  tags,
  badgeType,
  uploadedBy,
  fileSize = '2.5 MB',
  versions = []
}: AdminDocumentCardProps) {
  const [showVersions, setShowVersions] = useState(false);

  // If no versions provided, create a default version from the current document
  const documentVersions = versions.length > 0 ? versions : [
    {
      title: `${title} V0`,
      updated: updatedDate,
      author: uploadedBy,
      fileType,
      fileSize,
      access: ['Admin', 'Batch2023', 'Batch2027', 'Batch2028'],
      viewUrl: '#'
    }
  ];

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-shadow duration-300">
        <div className="flex justify-between">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-[0_4px_10px_rgb(59,130,246,0.2)]">
                  <DocumentIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                  </h3>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Posted: {postedDate}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    By: {uploadedBy}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {fileType} • {fileSize}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Updated: {updatedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end space-y-2">
            <div className={`px-2.5 py-1 rounded-full ${badgeStyles[badgeType].bg} ${badgeStyles[badgeType].text} text-xs font-medium shadow-[0_2px_8px_rgb(0,0,0,0.05)]`}>
              {badgeType}
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <TrashIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <button 
              onClick={() => setShowVersions(true)}
              className="text-xs text-[#1A4EFF] dark:text-blue-400 hover:underline"
            >
              View Versions
            </button>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 shadow-[0_2px_4px_rgb(0,0,0,0.05)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={showVersions}
        onClose={() => setShowVersions(false)}
        title={title}
        lastUpdated={updatedDate}
        versions={documentVersions}
      />
    </>
  );
} 