import { Modal } from '@/components/ui/primitives/modal';
// DocumentCard no longer used – uniform compact preview instead

// minimal fields needed for a version preview
export interface VersionPreview {
  id: number;
  title: string;
  updated: string;
  author: string;
  fileType: string;
  viewUrl: string;
}

interface DocumentPreview {
  title: string;
  updated: string;
  author: string;
  fileType: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  document?: any; // raw doc object from admin page
  version?: VersionPreview;     // provided when deleting a version
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, document, version }: DeleteConfirmationModalProps) {
  return (
    <Modal id="delete-document" isOpen={isOpen} onClose={onClose} className="w-full max-w-xl flex flex-col">
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-center">
          {version ? 'Are you sure you want to delete this version?' : 'Are you sure you want to delete the document?'}
        </h2>

        {/* Preview */}
        {(()=>{
          const preview: DocumentPreview | null = version ? {
            title: version.title,
            updated: version.updated,
            author: version.author,
            fileType: version.fileType,
          } : document ? {
            title: document.title,
            updated: document.updatedDate || document.postedDate || '',
            author: document.uploadedBy || 'Admin',
            fileType: document.fileType || '',
          } : null;

          if(!preview) return null;

          return (
          <div className="border border-gray-200 rounded-xl bg-gray-50 w-full mb-4" style={{padding:'24px',minHeight:'120px'}}>
            <div className="space-y-2">
              <h3
                className="text-gray-800 truncate"
                style={{
                  fontFamily: 'Open Sans',
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '100%'
                }}
              >
                {preview.title}
              </h3>
              <div className="flex items-center gap-4 text-gray-600"
                style={{fontFamily:'Open Sans',fontWeight:600,fontSize:'14px',lineHeight:'100%'}}>
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 10.5C9.5375 10.5 8.71354 10.1573 8.02813 9.47188C7.34271 8.78646 7 7.9625 7 7C7 6.0375 7.34271 5.21354 8.02813 4.52813C8.71354 3.84271 9.5375 3.5 10.5 3.5C11.4625 3.5 12.2865 3.84271 12.9719 4.52813C13.6573 5.21354 14 6.0375 14 7C14 7.9625 13.6573 8.78646 12.9719 9.47188C12.2865 10.1573 11.4625 10.5 10.5 10.5ZM3.5 17.5V15.05C3.5 14.5542 3.6276 14.0984 3.88281 13.6828C4.13802 13.2672 4.47708 12.95 4.9 12.7312C5.80417 12.2792 6.72292 11.9401 7.65625 11.7141C8.58958 11.488 9.5375 11.375 10.5 11.375C11.4625 11.375 12.4104 11.488 13.3438 11.7141C14.2771 11.9401 15.1958 12.2792 16.1 12.7312C16.5229 12.95 16.862 13.2672 17.1172 13.6828C17.3724 14.0984 17.5 14.5542 17.5 15.05V17.5H3.5Z" fill="#79747E"/></svg>
                  <span className="font-semibold mr-1">By:</span> {preview.author}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="font-semibold mr-1">Updated:</span> {preview.updated}
                </span>
              </div>
              <p className="flex items-center gap-1 text-gray-600 uppercase" style={{fontFamily:'Open Sans',fontWeight:600,fontSize:'14px',lineHeight:'100%'}}>
                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 1.75H3.75C3.41848 1.75 3.10054 1.8817 2.86612 2.11612C2.6317 2.35054 2.5 2.66848 2.5 3V13C2.5 13.3315 2.6317 13.6495 2.86612 13.8839C3.10054 14.1183 3.41848 14.25 3.75 14.25H11.25C11.5815 14.25 11.8995 14.1183 12.1339 13.8839C12.3683 13.6495 12.5 13.3315 12.5 13V5.5M8.75 1.75L12.5 5.5M8.75 1.75L8.75 5.5H12.5M10 8.625H5M10 11.125H5M6.25 6.125H5" stroke="#8A8A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {preview.fileType}
              </p>
            </div>
          </div>
          );
        })()}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={onConfirm}
            className="text-white"
            style={{
              width: '74px',
              height: '49px',
              borderRadius: '12px',
              background: 'linear-gradient(90.57deg, #628EFF 9.91%, #8740CD 53.29%, #580475 91.56%)',
              opacity: 1,
              padding: '14px 20px',
              gap: '10px',
              fontFamily: 'Open Sans',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '-3%',
              verticalAlign: 'middle'
            }}
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="text-gray-800 font-medium shadow hover:bg-gray-400"
            style={{
              width: '74px',
              height: '49px',
              borderRadius: '12px',
              background: '#D1D5DB', /* gray-300 */
              padding: '14px 20px',
              gap: '10px',
              fontFamily: 'Open Sans',
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '-3%'
            }}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
} 