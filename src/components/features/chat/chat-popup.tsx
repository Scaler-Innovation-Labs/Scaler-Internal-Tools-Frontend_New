import React, { useState } from 'react';
import { ChatIcon } from '@/components/ui/icons/chat-icon';
import { Button } from '@/components/ui/primitives/button';

const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1920_1015)">
      <path d="M16.0002 20.0002C18.2093 20.0002 20.0002 18.2093 20.0002 16.0002C20.0002 13.791 18.2093 12.0002 16.0002 12.0002C13.791 12.0002 12.0002 13.791 12.0002 16.0002C12.0002 18.2093 13.791 20.0002 16.0002 20.0002Z" stroke="#4D4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M25.8668 20.0002C25.6893 20.4023 25.6364 20.8484 25.7148 21.2809C25.7932 21.7135 25.9994 22.1126 26.3068 22.4268L26.3868 22.5068C26.6348 22.7545 26.8315 23.0486 26.9657 23.3723C27.0999 23.696 27.1689 24.0431 27.1689 24.3935C27.1689 24.7439 27.0999 25.0909 26.9657 25.4147C26.8315 25.7384 26.6348 26.0325 26.3868 26.2802C26.1392 26.5281 25.8451 26.7248 25.5213 26.859C25.1976 26.9932 24.8506 27.0623 24.5002 27.0623C24.1497 27.0623 23.8027 26.9932 23.479 26.859C23.1553 26.7248 22.8612 26.5281 22.6135 26.2802L22.5335 26.2002C22.2193 25.8928 21.8201 25.6866 21.3876 25.6082C20.9551 25.5297 20.509 25.5827 20.1068 25.7602C19.7125 25.9292 19.3761 26.2098 19.1392 26.5675C18.9023 26.9253 18.7752 27.3444 18.7735 27.7735V28.0002C18.7735 28.7074 18.4925 29.3857 17.9924 29.8858C17.4923 30.3859 16.8141 30.6668 16.1068 30.6668C15.3996 30.6668 14.7213 30.3859 14.2212 29.8858C13.7211 29.3857 13.4402 28.7074 13.4402 28.0002V27.8802C13.4298 27.4388 13.287 27.0108 13.0302 26.6518C12.7734 26.2927 12.4145 26.0192 12.0002 25.8668C11.598 25.6893 11.1519 25.6364 10.7194 25.7148C10.2869 25.7932 9.88773 25.9994 9.5735 26.3068L9.4935 26.3868C9.24583 26.6348 8.95173 26.8315 8.628 26.9657C8.30427 27.0999 7.95727 27.1689 7.60683 27.1689C7.25639 27.1689 6.90938 27.0999 6.58565 26.9657C6.26193 26.8315 5.96782 26.6348 5.72016 26.3868C5.47223 26.1392 5.27553 25.8451 5.14134 25.5213C5.00714 25.1976 4.93806 24.8506 4.93806 24.5002C4.93806 24.1497 5.00714 23.8027 5.14134 23.479C5.27553 23.1553 5.47223 22.8612 5.72016 22.6135L5.80016 22.5335C6.10754 22.2193 6.31374 21.8201 6.39217 21.3876C6.47059 20.9551 6.41765 20.509 6.24016 20.1068C6.07115 19.7125 5.7905 19.3761 5.43278 19.1392C5.07506 18.9023 4.65588 18.7752 4.22683 18.7735H4.00016C3.29292 18.7735 2.61464 18.4925 2.11454 17.9924C1.61445 17.4923 1.3335 16.8141 1.3335 16.1068C1.3335 15.3996 1.61445 14.7213 2.11454 14.2212C2.61464 13.7211 3.29292 13.4402 4.00016 13.4402H4.12016C4.56149 13.4298 4.9895 13.287 5.34856 13.0302C5.70762 12.7734 5.98112 12.4145 6.1335 12.0002C6.31098 11.598 6.36393 11.1519 6.2855 10.7194C6.20708 10.2869 6.00088 9.88773 5.6935 9.5735L5.6135 9.4935C5.36556 9.24583 5.16887 8.95173 5.03467 8.628C4.90047 8.30427 4.8314 7.95727 4.8314 7.60683C4.8314 7.25639 4.90047 6.90938 5.03467 6.58565C5.16887 6.26193 5.36556 5.96782 5.6135 5.72016C5.86116 5.47223 6.15526 5.27553 6.47899 5.14134C6.80272 5.00714 7.14972 4.93806 7.50016 4.93806C7.8506 4.93806 8.19761 5.00714 8.52134 5.14134C8.84506 5.27553 9.13917 5.47223 9.38683 5.72016L9.46683 5.80016C9.78107 6.10754 10.1802 6.31374 10.6127 6.39217C11.0452 6.47059 11.4913 6.41765 11.8935 6.24016H12.0002C12.3945 6.07115 12.7309 5.7905 12.9678 5.43278C13.2047 5.07506 13.3318 4.65588 13.3335 4.22683V4.00016C13.3335 3.29292 13.6144 2.61464 14.1145 2.11454C14.6146 1.61445 15.2929 1.3335 16.0002 1.3335C16.7074 1.3335 17.3857 1.61445 17.8858 2.11454C18.3859 2.61464 18.6668 3.29292 18.6668 4.00016V4.12016C18.6685 4.54921 18.7957 4.9684 19.0326 5.32612C19.2695 5.68384 19.6058 5.96448 20.0002 6.1335C20.4023 6.31098 20.8484 6.36393 21.2809 6.2855C21.7135 6.20708 22.1126 6.00088 22.4268 5.6935L22.5068 5.6135C22.7545 5.36556 23.0486 5.16887 23.3723 5.03467C23.696 4.90047 24.0431 4.8314 24.3935 4.8314C24.7439 4.8314 25.0909 4.90047 25.4147 5.03467C25.7384 5.16887 26.0325 5.36556 26.2802 5.6135C26.5281 5.86116 26.7248 6.15526 26.859 6.47899C26.9932 6.80272 27.0623 7.14972 27.0623 7.50016C27.0623 7.8506 26.9932 8.19761 26.859 8.52134C26.7248 8.84506 26.5281 9.13917 26.2802 9.38683L26.2002 9.46683C25.8928 9.78107 25.6866 10.1802 25.6082 10.6127C25.5297 11.0452 25.5827 11.4913 25.7602 11.8935V12.0002C25.9292 12.3945 26.2098 12.7309 26.5675 12.9678C26.9253 13.2047 27.3444 13.3318 27.7735 13.3335H28.0002C28.7074 13.3335 29.3857 13.6144 29.8858 14.1145C30.3859 14.6146 30.6668 15.2929 30.6668 16.0002C30.6668 16.7074 30.3859 17.3857 29.8858 17.8858C29.3857 18.3859 28.7074 18.6668 28.0002 18.6668H27.8802C27.4511 18.6685 27.0319 18.7957 26.6742 19.0326C26.3165 19.2695 26.0358 19.6058 25.8668 20.0002Z" stroke="#4D4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_1920_1015">
        <rect width="32" height="32" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Handle send message
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        <ChatIcon className="w-6 h-6 text-white transform transition-transform duration-300" />
      </Button>

      {/* Chat Popup */}
      <div
        className={`absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-300 transform ${
          isOpen
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="py-2 px-4 bg-[linear-gradient(90.57deg,#2E4CEE_9.91%,#221EBF_53.29%,#040F75_91.56%)] rounded-t-lg">
          <h3 className="text-lg font-semibold text-white">Policy Chat Bot</h3>
        </div>
        
        <div className="h-80 p-4 overflow-y-auto">
          {/* Chat messages would go here */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Hello! I'm your policy assistant. How can I help you today?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about policies..."
              className="w-full px-4 py-2 pr-24 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={() => {}}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '8px',
                  background: '#E0E5EC'
                }}
                className="flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <SettingsIcon />
              </button>
              <button
                onClick={handleSendMessage}
                style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '8px',
                  background: 'linear-gradient(90.57deg, #628EFF 9.91%, #8740CD 53.29%, #580475 91.56%)'
                }}
                className="flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 