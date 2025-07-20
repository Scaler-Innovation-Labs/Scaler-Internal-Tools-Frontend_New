import { documentFilters } from '@/lib/constants';

interface DocumentFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function DocumentFilters({ activeFilter, onFilterChange }: DocumentFiltersProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-1 py-1">
      {documentFilters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`
            ${filter === 'All' ? 'w-[69px]' : 'min-w-[106px]'} 
            h-[39px] px-5 rounded-[40px] border-[0.3px] font-roboto font-medium text-[15px] leading-none tracking-[0.02em] transition-all duration-200 whitespace-nowrap
            ${activeFilter === filter
              ? 'bg-blue-600 text-white border-transparent'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
} 