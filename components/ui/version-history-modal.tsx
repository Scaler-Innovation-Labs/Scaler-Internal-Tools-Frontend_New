import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Modal } from './modal';

interface Version {
  title: string;
  updated: string;
  author: string;
  fileType: string;
  fileSize: string;
  access: string[];
  viewUrl: string;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lastUpdated: string;
  versions: Version[];
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  title,
  lastUpdated,
  versions
}: VersionHistoryModalProps) {
  return (
    <Modal
      id="version-history"
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Last Updated: {lastUpdated}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Version List */}
      <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-100px)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#1A4EFF] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-700">
        {versions.map((version, index) => (
          <div 
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {version.title}
              </h3>
              <a 
                href={version.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#1A4EFF] hover:underline text-sm font-medium"
              >
                View
                <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Info Row 1 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                👤 By: {version.author}
              </span>
              <span className="flex items-center">
                🕒 Updated: {version.updated}
              </span>
            </div>

            {/* Info Row 2 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                📄 File Type: {version.fileType}
              </span>
              <span className="flex items-center">
                📦 Size: {version.fileSize}
              </span>
            </div>

            {/* Info Row 3 */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="block">👥 Access Groups:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {version.access.map((group, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
} 