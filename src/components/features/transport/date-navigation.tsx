'use client';

import { format, addDays, subDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DateNavigationProps {
  currentDate: Date;
  className?: string;
}

export function DateNavigation({ currentDate, className }: DateNavigationProps) {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const yesterday = subDays(currentDate, 1);
  const nextDay = addDays(currentDate, 1);

  const formatDateForUrl = (date: Date) => format(date, 'yyyy-MM-dd');
  
  const isToday = format(currentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  const isTomorrow = format(currentDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');

  return (
    <div className={cn("flex flex-col sm:flex-row items-center gap-4", className)}>
      {/* Quick Navigation */}
      <div className="flex gap-2">
        <Link
          href={`/transport/${formatDateForUrl(today)}`}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm",
            isToday
              ? "bg-[#2E4CEE] text-white hover:bg-[#2E4CEE]/90"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
          )}
        >
          Today
        </Link>
        <Link
          href={`/transport/${formatDateForUrl(tomorrow)}`}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm",
            isTomorrow
              ? "bg-[#2E4CEE] text-white hover:bg-[#2E4CEE]/90"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
          )}
        >
          Tomorrow
        </Link>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-2">
        <Link
          href={`/transport/${formatDateForUrl(yesterday)}`}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all duration-200"
          title="Previous day"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 min-w-[120px]">
            {format(currentDate, 'MMM dd, yyyy')}
          </span>
        </div>

        <Link
          href={`/transport/${formatDateForUrl(nextDay)}`}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all duration-200"
          title="Next day"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
