export const badgeStyles = {
  Important: {
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  Events: {
    bg: 'bg-purple-50',
    text: 'text-purple-600'
  },
  Administrative: {
    bg: 'bg-green-50',
    text: 'text-green-600'
  }
} as const;

export const documentFilters = ['All', 'Academic', 'Events', 'Administrative', 'Important'] as const; 