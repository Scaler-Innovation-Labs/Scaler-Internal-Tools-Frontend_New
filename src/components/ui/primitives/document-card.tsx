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
}

export function DocumentCard({
  title,
  postedDate,
  fileType,
  updatedDate,
  tags,
  badgeType,
}: DocumentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CustomDocumentIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posted on {postedDate}
            </p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full ${documentBadgeStyles[badgeType].bg} ${documentBadgeStyles[badgeType].text} text-xs font-medium shadow-[0_2px_8px_rgb(0,0,0,0.05)]`}>
          {badgeType}
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
  );
} 