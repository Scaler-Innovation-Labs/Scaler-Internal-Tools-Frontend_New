interface DocumentFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = ['All', 'Academic', 'Events', 'Administrative', 'Important'];

export function DocumentFilters({ activeFilter, onFilterChange }: DocumentFiltersProps) {
  return (
    <div className="flex space-x-3 overflow-x-auto py-4 px-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`
            px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
            ${activeFilter === filter
              ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgb(37,99,235,0.2)]'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-[0_2px_8px_rgb(0,0,0,0.05)]'
            }
          `}
        >
          {filter}
        </button>
      ))}
    </div>
  );
} 