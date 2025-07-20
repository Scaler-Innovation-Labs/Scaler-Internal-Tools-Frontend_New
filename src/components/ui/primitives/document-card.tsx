import { Badge } from '@/components/ui/primitives/badge';
import { documentBadgeStyles } from '@/lib/constants';
import { CustomDocumentIcon } from '@/components/ui/icons/document-icon';

interface DocumentCardProps {
  title: string;
  postedDate: string;
  fileType: string;
  updatedDate: string;
  tags: string[];
  badgeType: 'Important' | 'Events' | 'Administrative';
  uploadedBy?: string;
  fileUrl?: string;
}

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10.6667 1.3335V4.00016M5.33333 1.3335V4.00016M2 6.66683H14M3.33333 2.66683H12.6667C13.403 2.66683 14 3.26378 14 4.00016V13.3335C14 14.0699 13.403 14.6668 12.6667 14.6668H3.33333C2.59695 14.6668 2 14.0699 2 13.3335V4.00016C2 3.26378 2.59695 2.66683 3.33333 2.66683Z" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_1416_868)">
      <path d="M8.00016 4.00016V8.00016L10.6668 9.3335M14.6668 8.00016C14.6668 11.6821 11.6821 14.6668 8.00016 14.6668C4.31826 14.6668 1.3335 11.6821 1.3335 8.00016C1.3335 4.31826 4.31826 1.3335 8.00016 1.3335C11.6821 1.3335 14.6668 4.31826 14.6668 8.00016Z" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_1416_868">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export function DocumentCard({
  title,
  postedDate,
  fileType,
  updatedDate,
  tags,
  badgeType,
  uploadedBy,
  fileUrl,
}: DocumentCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-[0_6px_24px_rgb(0,0,0,0.12),0_8px_12px_rgb(0,0,0,0.08)] cursor-pointer border border-gray-100 dark:border-gray-700 mt-4"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <CustomDocumentIcon />
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
            style={documentBadgeStyles[badgeType].style}
          >
            {badgeType}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between mt-4 text-sm" style={{ fontFamily: 'Open Sans', fontWeight: 600, lineHeight: '100%', letterSpacing: '-3%', verticalAlign: 'middle', color: '#8A8A8A' }}>
        <div className="flex items-center flex-wrap gap-4 ml-3">
          <div className="uppercase text-sm px-2 py-0.5 rounded">{fileType}</div>
          <div className="flex items-center gap-1"><ClockIcon className="w-4 h-4"/> Updated: {updatedDate}</div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 ml-3">
          {tags.map((tag, index) => {
            console.log('Tag:', tag, 'Type:', typeof tag, 'Length:', tag?.length);
            return (
              <span 
                key={index}
                className="px-2 py-1 rounded-full text-xs shadow-[0_2px_8px_rgb(0,0,0,0.06)]"
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
                #{tag || 'empty'}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
} 