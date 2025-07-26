import { useState, useRef, useEffect, useCallback } from 'react';

// Svg icons
const FilterIcon = ({ className }: { className?: string }) => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3.83333 2.875H19.1667C19.4208 2.875 19.6646 2.97597 19.8443 3.15569C20.024 3.33541 20.125 3.57917 20.125 3.83333V5.35325C20.1249 5.60739 20.0239 5.85111 19.8442 6.03079L13.6975 12.1775C13.5177 12.3572 13.4167 12.6009 13.4167 12.8551V18.8974C13.4167 19.043 13.3834 19.1868 13.3196 19.3177C13.2557 19.4486 13.1628 19.5632 13.0479 19.6529C12.9331 19.7425 12.7993 19.8047 12.6568 19.8349C12.5143 19.8651 12.3668 19.8624 12.2255 19.827L10.3088 19.3478C10.1016 19.2959 9.91761 19.1762 9.78617 19.0078C9.65473 18.8394 9.58334 18.6318 9.58333 18.4182V12.8551C9.58328 12.6009 9.48228 12.3572 9.30254 12.1775L3.15579 6.03079C2.97606 5.85111 2.87505 5.60739 2.875 5.35325V3.83333C2.875 3.57917 2.97597 3.33541 3.15569 3.15569C3.33541 2.97597 3.57917 2.875 3.83333 2.875Z" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SortIcon = ({ className }: { className?: string }) => (
  <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4.81239 3.9375C4.81239 3.75516 4.73996 3.5803 4.61103 3.45136C4.4821 3.32243 4.30723 3.25 4.12489 3.25C3.94256 3.25 3.76769 3.32243 3.63876 3.45136C3.50982 3.5803 3.43739 3.75516 3.43739 3.9375V16.0279L1.86164 14.4508C1.73255 14.3217 1.55746 14.2491 1.37489 14.2491C1.19233 14.2491 1.01724 14.3217 0.888142 14.4508C0.759048 14.5798 0.686523 14.7549 0.686523 14.9375C0.686523 15.1201 0.759048 15.2952 0.888142 15.4243L3.63814 18.1729L3.64777 18.1825C3.77685 18.3084 3.95043 18.3781 4.13072 18.3766C4.311 18.375 4.48336 18.3023 4.61027 18.1743L7.36027 15.4243C7.42419 15.3604 7.47491 15.2846 7.50954 15.2012C7.54417 15.1178 7.56202 15.0283 7.56209 14.938C7.56215 14.8477 7.54442 14.7582 7.50991 14.6747C7.4754 14.5912 7.42479 14.5154 7.36095 14.4514C7.29712 14.3875 7.22133 14.3368 7.13789 14.3022C7.05446 14.2675 6.96502 14.2497 6.87469 14.2496C6.78436 14.2496 6.6949 14.2673 6.61141 14.3018C6.52793 14.3363 6.45206 14.3869 6.38814 14.4508L4.81239 16.0279V3.9375Z" fill="#666666"/>
    <path d="M9.62489 5.3125C9.62489 5.13016 9.69732 4.9553 9.82626 4.82636C9.95519 4.69743 10.1301 4.625 10.3124 4.625H19.9374C20.1197 4.625 20.2946 4.69743 20.4235 4.82636C20.5525 4.9553 20.6249 5.13016 20.6249 5.3125C20.6249 5.49484 20.5525 5.6697 20.4235 5.79864C20.2946 5.92757 20.1197 6 19.9374 6H10.3124Z" fill="#666666"/>
    <path d="M10.3124 8.75C10.1301 8.75 9.95519 8.82243 9.82626 8.95136C9.69732 9.0803 9.62489 9.25516 9.62489 9.4375C9.62489 9.61984 9.69732 9.7947 9.82626 9.92364C9.95519 10.0526 10.1301 10.125 10.3124 10.125H17.1874C17.3697 10.125 17.5446 10.0526 17.6735 9.92364C17.8025 9.7947 17.8749 9.61984 17.8749 9.4375C17.8749 9.25516 17.8025 9.0803 17.6735 8.95136C17.5446 8.82243 17.3697 8.75 17.1874 8.75H10.3124Z" fill="#666666"/>
    <path d="M10.3124 12.875C10.1301 12.875 9.95519 12.9474 9.82626 13.0764C9.69732 13.2053 9.62489 13.3802 9.62489 13.5625C9.62489 13.7448 9.69732 13.9197 9.82626 14.0486C9.95519 14.1776 10.1301 14.25 10.3124 14.25H14.4374C14.6197 14.25 14.7946 14.1776 14.9235 14.0486C15.0525 13.9197 15.1249 13.7448 15.1249 13.5625C15.1249 13.3802 15.0525 13.2053 14.9235 13.0764C14.7946 12.9474 14.6197 12.875 14.4374 12.875H10.3124Z" fill="#666666"/>
    <path d="M10.3124 17C10.1301 17 9.95519 17.0724 9.82626 17.2014C9.69732 17.3303 9.62489 17.5052 9.62489 17.6875C9.62489 17.8698 9.69732 18.0447 9.82626 18.1736C9.95519 18.3026 10.1301 18.375 10.3124 18.375H11.6874C11.8697 18.375 12.0446 18.3026 12.1735 18.1736C12.3025 18.0447 12.3749 17.8698 12.3749 17.6875C12.3749 17.5052 12.3025 17.3303 12.1735 17.2014C12.0446 17.0724 11.8697 17 11.6874 17H10.3124Z" fill="#666666"/>
  </svg>
);

interface DocumentFiltersProps {
  /**
   * List of category chips to display following "All" (could include "Others")
   */
  categories: string[];
  /** Currently active (single) chip filter – "All", a category name, or "Others" */
  activeFilter: string;
  /** Callback when chip filter changes */
  onFilterChange: (filter: string) => void;
  /** All available categories in the system (for dropdown multi-select) */
  allCategories: string[];
  /** Currently selected categories from the dropdown multi-select */
  selectedCategories: string[];
  /** Callback when the dropdown multi-select selection changes */
  onSelectedCategoriesChange: (categories: string[]) => void;
  /** Sort order for updated date */
  sortOrder: 'asc' | 'desc';
  /** Toggle sort order handler */
  onSortToggle: () => void;
}

export function DocumentFilters({
  categories,
  activeFilter,
  onFilterChange,
  allCategories = [], // Add default empty array for allCategories
  selectedCategories = [], // Keep default empty array for selectedCategories
  onSelectedCategoriesChange,
  sortOrder,
  onSortToggle,
}: DocumentFiltersProps) {
  const filters = ['All', ...categories];
  const [showDropdown, setShowDropdown] = useState(false);
  // Ref to detect outside clicks
  const containerRef = useRef<HTMLDivElement>(null);

  const applyDropdown = useCallback(() => {
    setShowDropdown(false);
    // Update chip selection based on dropdown state
    if ((selectedCategories || []).length === 1) {
      const only = selectedCategories[0];
      if (only) {
        const mapped = categories.includes(only) ? only : 'Others';
        onFilterChange(mapped);
      }
    } else if ((selectedCategories || []).length === 0) {
      onFilterChange('All');
    } else {
      onFilterChange(''); // no chip active when multi-select
    }
  }, [categories, onFilterChange, selectedCategories]);

  // Close dropdown and apply filters when clicking outside
  useEffect(() => {
    if (!showDropdown) return;

    const handleOutside = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        applyDropdown();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showDropdown, applyDropdown]);

  // Clicking a chip should also sync the checkbox selection state
  const handleChipClick = (filter: string) => {
    if (filter === 'All') {
      onSelectedCategoriesChange([]);
    } else if (filter === 'Others') {
      // When clicking Others chip we keep previously selected categories if any
      // else clear
      if (selectedCategories.length === 0) {
        onSelectedCategoriesChange([]);
      }
    } else {
      onSelectedCategoriesChange([filter]);
    }
    onFilterChange(filter);
  };

  // Categories prop already contains desired chips (top N + 'Others' if applicable)

  const toggleCategory = (cat: string) => {
    let next: string[];
    if ((selectedCategories || []).includes(cat)) {
      next = (selectedCategories || []).filter((c) => c !== cat);
    } else {
      next = [...(selectedCategories || []), cat];
    }
    onSelectedCategoriesChange(next);
  };

  return (
    <div ref={containerRef} className="flex items-center justify-between w-full">
      {/* Left side: Category chips */}
      <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide px-1 py-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleChipClick(filter)}
            className={`
              ${filter === 'All' ? 'w-[69px]' : 'min-w-[106px]'}
              h-[39px] px-5 rounded-[40px] border-[0.3px] font-roboto font-medium text-[15px] leading-none tracking-[0.02em] transition-all duration-200 whitespace-nowrap
              ${activeFilter === filter ? 'bg-blue-600 text-white border-transparent' : 'bg-white text-gray-600 border-[#6F6F6F] hover:bg-gray-50'}
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Right side: Sort and Filter buttons */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Sort toggle */}
        <button
          onClick={onSortToggle}
          className="flex items-center space-x-1 min-w-[90px] h-[39px] px-4 rounded-[40px] border-[0.3px] font-roboto font-medium text-[15px] leading-none tracking-[0.02em] transition-all duration-200 whitespace-nowrap bg-white text-gray-600 border-gray-200 hover:bg-gray-50" style={{boxShadow:'0px 0px 4px 0px #00000040'}}
        >
          <SortIcon className={
            `w-4 h-4 transform transition-transform duration-200 ${sortOrder === 'asc' ? 'rotate-180' : ''}`
          } />
          <span>Sort</span>
        </button>

        {/* Filter dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((o) => !o)}
            className={`
              relative flex items-center justify-center space-x-1 min-w-[100px] h-[39px] px-4 rounded-[40px] border-[0.3px] font-roboto font-medium text-[15px] leading-none tracking-[0.02em] transition-all duration-200 whitespace-nowrap
              bg-white hover:bg-gray-50 ${showDropdown || (selectedCategories || []).length > 0 ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-gray-200'}
            `}
            style={{boxShadow:'0px 0px 4px 0px #00000040'}}
          >
            <FilterIcon className="w-4 h-4" />
            <span>Filter</span>
            {(selectedCategories || []).length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">
                {selectedCategories.length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-h-[400px] overflow-y-auto w-64">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filter by Categories</p>
                {(selectedCategories || []).length > 0 && (
                  <button
                    onClick={() => {
                      onSelectedCategoriesChange([]);
                      onFilterChange('All');
                      setShowDropdown(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {(allCategories || []).map((cat) => (
                  <label key={cat} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={(selectedCategories || []).includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                      {cat || '(Uncategorised)'}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={applyDropdown}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 