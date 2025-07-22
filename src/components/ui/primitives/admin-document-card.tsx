import { useState, useEffect, useMemo } from 'react';
import { ArrowTopRightOnSquareIcon, UserIcon } from '@heroicons/react/24/outline';
import { AdminDocumentIcon, EditIcon, DeleteIcon, CalendarIcon, ClockIcon } from '@/components/ui/icons/admin-icons';
import { VersionHistoryModal } from '@/components/ui/primitives/version-history-modal';
import { useDocumentAdmin } from '@/hooks/api/use-document-admin';

interface AdminDocumentCardProps {
  id: number;
  title: string;
  postedDate: string;
  updatedDate: string;
  fileType: string;
  tags: string[];
  categoryName: string;
  uploadedBy: string;
  fileSize?: string;
  fileUrl?: string;
  versions?: Array<{
    title: string;
    updated: string;
    author: string;
    fileType: string;
    fileSize: string;
    access: string[];
    viewUrl: string;
  }>;
  [key:string]: any;
}

export function AdminDocumentCard({
  title,
  postedDate,
  updatedDate,
  fileType,
  tags,
  categoryName,
  uploadedBy,
  fileSize = '2.5 MB',
  fileUrl,
  versions = [],
  id,
  onEdit,
  onDelete
}: AdminDocumentCardProps & { onEdit?: (id:number)=>void; onDelete?: (id:number)=>void }) {
  const [showVersions, setShowVersions] = useState(false);
  const style = useMemo(()=>{
    const palette=['#1D5DDF','#7E22CE','#15803D','#D97706','#0E7490','#DB2777','#92400E'];
    const hash=Array.from(categoryName).reduce((a,c)=>a+c.charCodeAt(0),0);
    const color=palette[hash%palette.length];
    return {backgroundColor:color,border:`0.2px solid ${color}`,color:'white'} as React.CSSProperties;
  },[categoryName]);
  const { fetchVersions } = useDocumentAdmin();
  const [versionList,setVersionList]=useState<any[]>(versions);

  const loadVersions=async()=>{
    const data=await fetchVersions(id);
    setVersionList(data);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
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
      allowedUsers: (versions[0]?.access)||['Admin'],
      viewUrl: '#'
    }
  ];

  return (
    <>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-[0_6px_24px_rgb(0,0,0,0.12),0_8px_12px_rgb(0,0,0,0.08)] cursor-pointer border border-gray-100 dark:border-gray-700 mt-4"
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <AdminDocumentIcon />
            <div>
              <div className="flex items-center gap-1 font-semibold text-lg" style={{ fontWeight: 600, color: '#585858' }}>
                <span>{title}</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.3335 3.3335H5.00016C4.55814 3.3335 4.13421 3.50909 3.82165 3.82165C3.50909 4.13421 3.3335 4.55814 3.3335 5.00016V15.0002C3.3335 15.4422 3.50909 15.8661 3.82165 16.1787C4.13421 16.4912 4.55814 16.6668 5.00016 16.6668H15.0002C15.4422 16.6668 15.8661 16.4912 16.1787 16.1787C16.4912 15.8661 16.6668 15.4422 16.6668 15.0002V11.6668M10.0002 10.0002L16.6668 3.3335M16.6668 3.3335V7.50016M16.6668 3.3335H12.5002" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex items-center gap-1 text-sm mt-1" style={{ fontFamily: 'Open Sans', fontWeight: 600, lineHeight: '100%', letterSpacing: '-3%', verticalAlign: 'middle', color: '#8A8A8A' }}>
                <CalendarIcon className="w-4 h-4" />
                <span>Posted: {postedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div 
              className="px-2.5 py-1 rounded-full text-xs font-medium shadow-[0_2px_12px_rgb(0,0,0,0.08)]"
              style={style}
            >
              {categoryName || 'Category'}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>onEdit?.(id)} className="rounded-full p-1.5 hover:bg-gray-100 shadow-[0_2px_8px_rgb(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.1)] transition-all duration-200"><EditIcon/></button>
              <button onClick={()=>onDelete?.(id)} className="rounded-full p-1.5 hover:bg-gray-100 shadow-[0_2px_8px_rgb(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.1)] transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.25 4.5H3.75M3.75 4.5H15.75M3.75 4.5V15C3.75 15.3978 3.90804 15.7794 4.18934 16.0607C4.47064 16.342 4.85218 16.5 5.25 16.5H12.75C13.1478 16.5 13.5294 16.342 13.8107 16.0607C14.092 15.7794 14.25 15.3978 14.25 15V4.5M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5M7.5 8.25V12.75M10.5 8.25V12.75" stroke="#E33629" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Metadata and Versions link */}
         <div className="flex items-center justify-between mt-1 text-sm" style={{ fontFamily: 'Open Sans', fontWeight: 600, lineHeight: '100%', letterSpacing: '-3%', verticalAlign: 'middle', color: '#8A8A8A' }}>
           <div className="flex items-center flex-wrap gap-4 ml-3">
             <div className="flex items-center gap-1">
               <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M10.5 10.5C9.5375 10.5 8.71354 10.1573 8.02813 9.47188C7.34271 8.78646 7 7.9625 7 7C7 6.0375 7.34271 5.21354 8.02813 4.52813C8.71354 3.84271 9.5375 3.5 10.5 3.5C11.4625 3.5 12.2865 3.84271 12.9719 4.52813C13.6573 5.21354 14 6.0375 14 7C14 7.9625 13.6573 8.78646 12.9719 9.47188C12.2865 10.1573 11.4625 10.5 10.5 10.5ZM3.5 17.5V15.05C3.5 14.5542 3.6276 14.0984 3.88281 13.6828C4.13802 13.2672 4.47708 12.95 4.9 12.7312C5.80417 12.2792 6.72292 11.9401 7.65625 11.7141C8.58958 11.488 9.5375 11.375 10.5 11.375C11.4625 11.375 12.4104 11.488 13.3438 11.7141C14.2771 11.9401 15.1958 12.2792 16.1 12.7312C16.5229 12.95 16.862 13.2672 17.1172 13.6828C17.3724 14.0984 17.5 14.5542 17.5 15.05V17.5H3.5ZM5.25 15.75H15.75V15.05C15.75 14.8896 15.7099 14.7437 15.6297 14.6125C15.5495 14.4812 15.4438 14.3792 15.3125 14.3063C14.525 13.9125 13.7302 13.6172 12.9281 13.4203C12.126 13.2234 11.3167 13.125 10.5 13.125C9.68333 13.125 8.87396 13.2234 8.07188 13.4203C7.26979 13.6172 6.475 13.9125 5.6875 14.3063C5.55625 14.3792 5.45052 14.4812 5.37031 14.6125C5.2901 14.7437 5.25 14.8896 5.25 15.05V15.75ZM10.5 8.75C10.9812 8.75 11.3932 8.57865 11.7359 8.23594C12.0786 7.89323 12.25 7.48125 12.25 7C12.25 6.51875 12.0786 6.10677 11.7359 5.76406C11.3932 5.42135 10.9812 5.25 10.5 5.25C10.0188 5.25 9.60677 5.42135 9.26406 5.76406C8.92135 6.10677 8.75 6.51875 8.75 7C8.75 7.48125 8.92135 7.89323 9.26406 8.23594C9.60677 8.57865 10.0188 8.75 10.5 8.75Z" fill="#79747E"/>
               </svg>
               By: {uploadedBy}
             </div>
             <div className="uppercase text-sm px-2 py-0.5 rounded">{fileType}</div>
             <div className="flex items-center gap-1"><ClockIcon className="w-4 h-4"/> Updated: {updatedDate}</div>
           </div>
           <button className="text-xs text-[#1A4EFF] underline" onClick={async()=>{await loadVersions(); setShowVersions(true);}}>View Versions</button>
         </div>

        {/* Tags (consistent height) */}
        <div className="mt-2 flex flex-wrap gap-2 ml-3" style={{minHeight:'28px'}}>
          {tags.map((t,i)=>(
            <span 
              key={i} 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs shadow-[0_2px_8px_rgb(0,0,0,0.06)]" 
              style={{ 
                background: '#E0E0E08C',
                fontFamily: 'Open Sans',
                fontWeight: 600,
                lineHeight: '100%',
                letterSpacing: '-3%',
                verticalAlign: 'middle',
                color: '#4D4D4D'
              }}
            >
              #{t}
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