import React from 'react';

interface ChatIconProps {
  className?: string;
}

export const ChatIcon: React.FC<ChatIconProps> = ({ className }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M12 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5L2 22l5-1.338A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" 
      fill="currentColor"
    />
  </svg>
); 