import { useState, useEffect } from 'react';
import { ArrowTopRightOnSquareIcon, UserIcon } from '@heroicons/react/24/outline';
import { AdminDocumentIcon, EditIcon, DeleteIcon, CalendarIcon } from '@/components/ui/icons/admin-icons';
import { VersionHistoryModal } from '@/components/ui/primitives/version-history-modal';
import { documentBadgeStyles } from '@/lib/constants';
import { useDocumentAdmin } from '@/hooks/api/use-document-admin';

interface AdminDocumentCardProps {
  id: number;
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

export function AdminDocumentCard({
  title,
  postedDate,
  updatedDate,
  fileType,
  tags,
  badgeType,
  uploadedBy,
  fileSize = '2.5 MB',
  versions = [],
  id,
  onEdit,
  onDelete
}: AdminDocumentCardProps & { onEdit?: (id:number)=>void; onDelete?: (id:number)=>void }) {
  const [showVersions, setShowVersions] = useState(false);
  const { fetchVersions } = useDocumentAdmin();
  const [versionList,setVersionList]=useState<any[]>(versions);

  const loadVersions=async()=>{
    const data=await fetchVersions(id);
    setVersionList(data);
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow transition-shadow duration-300 hover:shadow-lg cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <AdminDocumentIcon />
            <div>
              <div className="flex items-center gap-1 text-[#1A85FF] font-semibold text-lg">
                <span>{title}</span>
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <CalendarIcon className="w-4 h-4" />
                <span>Posted: {postedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className={`px-2.5 py-1 rounded-full ${documentBadgeStyles[badgeType].bg} ${documentBadgeStyles[badgeType].text} text-xs font-medium`}>{badgeType}</div>
            <div className="flex items-center gap-2">
              <button onClick={()=>onEdit?.(id)} className="rounded-full p-1.5 hover:bg-gray-100"><EditIcon/></button>
              <button onClick={()=>onDelete?.(id)} className="rounded-full p-1.5 hover:bg-gray-100"><DeleteIcon/></button>
            </div>
          </div>
        </div>

        {/* Metadata and Versions link */}
         <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
           <div className="flex items-center flex-wrap gap-4">
             <div className="flex items-center gap-1"><UserIcon className="w-4 h-4"/> {uploadedBy}</div>
             <div className="uppercase text-xs px-2 py-0.5 bg-gray-100 rounded">{fileType}</div>
             <div className="flex items-center gap-1"><CalendarIcon className="w-4 h-4"/> Updated: {updatedDate}</div>
           </div>
           <button className="text-xs text-[#1A4EFF] underline" onClick={async()=>{await loadVersions(); setShowVersions(true);}}>View Versions</button>
         </div>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t,i)=>(<span key={i} className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">#{t}</span>))}
        </div>
      </div>

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={showVersions}
        onClose={() => setShowVersions(false)}
        title={title}
        lastUpdated={updatedDate}
        versions={versionList.map((v:any)=>({
          title:`${title} V${v.versionNumber}`,
          updated:new Date(v.uploadedAt).toLocaleDateString(),
          author:v.uploadedByEmail||uploadedBy,
          fileType:v.fileUrl.split('.').pop().toUpperCase(),
          fileSize:'-',
          access:v.allowedUsers||[],
          viewUrl:v.fileUrl,
        }))}
      />
    </>
  );
} 