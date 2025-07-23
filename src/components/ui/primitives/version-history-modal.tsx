import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { DeleteIcon } from '@/components/ui/icons/admin-icons';
import { Modal } from '@/components/ui/primitives/modal';

interface Version {
  id: number;
  title: string;
  updated: string;
  author: string;
  fileType: string;
  access: string[];
  allowedUsers?: string[];
  fileSize: string;
  viewUrl: string;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lastUpdated: string;
  versions: Version[];
  onDeleteVersion?: (id:number)=>void;
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  title,
  lastUpdated,
  versions,
  onDeleteVersion,
}: VersionHistoryModalProps) {
  return (
    <Modal
      id="version-history"
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800"
    >
      {/* Header */}
      <div className="p-6">
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
              <div className="flex items-center gap-3">
                <a 
                  href={version.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#1A4EFF] hover:underline text-sm font-medium"
                >
                  View
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
                </a>
                {onDeleteVersion && (
                  <button onClick={()=>onDeleteVersion(version.id)} className="p-1 rounded hover:bg-gray-100 transition-colors">
                    <DeleteIcon width={18} height={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Info Row 1 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 10.5C9.5375 10.5 8.71354 10.1573 8.02813 9.47188C7.34271 8.78646 7 7.9625 7 7C7 6.0375 7.34271 5.21354 8.02813 4.52813C8.71354 3.84271 9.5375 3.5 10.5 3.5C11.4625 3.5 12.2865 3.84271 12.9719 4.52813C13.6573 5.21354 14 6.0375 14 7C14 7.9625 13.6573 8.78646 12.9719 9.47188C12.2865 10.1573 11.4625 10.5 10.5 10.5ZM3.5 17.5V15.05C3.5 14.5542 3.6276 14.0984 3.88281 13.6828C4.13802 13.2672 4.47708 12.95 4.9 12.7312C5.80417 12.2792 6.72292 11.9401 7.65625 11.7141C8.58958 11.488 9.5375 11.375 10.5 11.375C11.4625 11.375 12.4104 11.488 13.3438 11.7141C14.2771 11.9401 15.1958 12.2792 16.1 12.7312C16.5229 12.95 16.862 13.2672 17.1172 13.6828C17.3724 14.0984 17.5 14.5542 17.5 15.05V17.5H3.5Z" fill="#79747E"/></svg>
                <span className="font-semibold mr-1">By:</span> {version.author}
              </span>
              <span className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="font-semibold mr-1">Updated:</span> {version.updated}
              </span>
            </div>

            {/* Info Row 2: File type */}
            <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mt-1 uppercase">
              {version.fileType}
            </div>

            {/* Info Row 3: Allowed users */}
            <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(()=>{
                const users = version.allowedUsers && version.allowedUsers.length ? version.allowedUsers : (version.access||[]);
                if(users.length===0) return <span className="text-gray-400">No allowed users</span>;
                return users.map((u:string,idx:number)=>(
                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {u.replace('_',' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}
                  </span>
                ));
              })()}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
} 