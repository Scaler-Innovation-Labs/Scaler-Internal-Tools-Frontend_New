import React, { useState, useEffect, useRef } from 'react';
import { ChatIcon } from '@/components/ui/icons/chat-icon';
import { Button } from '@/components/ui/primitives/button';
import { PolicyDocsService } from '@/services/api/policy-docs';
import { useAuth } from '@/hooks/auth/use-auth';
import { config } from '@/lib/configs';
import type { ChatBotDocResponseDto, Message } from '@/types/features/chat';

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

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6L18 18" />
  </svg>
);

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
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

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

type ViewType = 'chat' | 'settings';

export const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<ChatBotDocResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ documentName: '', file: null as File | null });
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { fetchWithAuth, isAuthenticated } = useAuth();
  const backendUrl = config.api.backendUrl;

  // Function to parse citations from chat response
  const parseCitations = (text: string) => {
    console.log('=== PARSING CITATIONS ===');
    console.log('Original text:', text);
    
    const citations: Array<{title: string, link: string, page?: string}> = [];
    let cleanText = text;

    // Regex to match citations in both formats: 
    // (title, Page: X, Link: url.pdf) OR {title, Page: X, Link: url.pdf}
    // Uses non-greedy matching to handle parentheses in URLs properly
    const citationRegex = /[\(\{]([^,]+),\s*Page:\s*(\d+),\s*Link:\s*(https?:\/\/.*?\.pdf)[\)\}]/g;
    
    let match;
    while ((match = citationRegex.exec(text)) !== null) {
      console.log('Found citation match:', match);
      const [fullMatch, providedTitle, page, link] = match;
      
      // Extract document title from URL if provided title is not meaningful
      let documentTitle = providedTitle.trim();
      
      // If title is very short or generic, try to extract from URL
      if (documentTitle.length < 4 || documentTitle.toLowerCase() === 'hey' || documentTitle.toLowerCase() === 'document' || documentTitle.toLowerCase() === 'dwa') {
        const urlMatch = link.match(/\/([^\/]+\.pdf)$/);
        if (urlMatch) {
          // Extract filename and clean it up
          const filename = urlMatch[1];
          // Remove UUID prefix if present (matches pattern: uuid_actualname.pdf)
          const cleanName = filename.replace(/^[a-f0-9\-]{36}_?/i, '');
          // Remove .pdf extension and decode URI
          documentTitle = decodeURIComponent(cleanName.replace(/\.pdf$/i, ''));
        }
      }
      
      citations.push({
        title: documentTitle,
        link: link.trim(),
        page: page ? page.trim() : undefined
      });
      
      // Remove citation from text (including any trailing periods or spaces)
      cleanText = cleanText.replace(fullMatch, '').replace(/\s*\.\s*$/, '.').trim();
    }

    console.log('Parsed citations:', citations);
    console.log('Clean text:', cleanText);
    console.log('========================');

    return { cleanText, citations };
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc =>
    doc.documentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate conversation ID based on user session
  useEffect(() => {
    if (isAuthenticated && !conversationId) {
      // Use timestamp as conversation ID for now - in production you'd use user ID
      setConversationId(`user_${Date.now()}`);
    }
  }, [isAuthenticated, conversationId]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Fetch documents when settings view is opened
  useEffect(() => {
    if (currentView === 'settings') {
      fetchDocuments();
    }
  }, [currentView]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await PolicyDocsService.getAllDocs(fetchWithAuth, backendUrl);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending || !conversationId) return;

    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);

    // Add user message to history
    const newUserMessage: Message = {
      content: userMessage,
      messageType: 'user',
      metadata: { timestamp: new Date().toISOString() }
    };

    setChatHistory(prev => [...prev, newUserMessage]);

    try {
      // Send message to backend
      const response = await PolicyDocsService.sendMessage(userMessage, conversationId, fetchWithAuth, backendUrl);
      
      // Parse citations from the response
      const { cleanText, citations } = parseCitations(response.answer);
      
      // Add bot response to history
      const botMessage: Message = {
        content: cleanText,
        messageType: 'assistant',
        metadata: { 
          timestamp: new Date().toISOString(),
          citations: citations
        }
      };

      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: Message = {
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        messageType: 'assistant',
        metadata: { timestamp: new Date().toISOString(), error: true }
      };

      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentView('chat');
    }
  };

  const handleSettingsClick = () => {
    setCurrentView('settings');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // More flexible PDF validation
      const isPdf = file.type === 'application/pdf' || 
                   file.type.includes('pdf') || 
                   file.name.toLowerCase().endsWith('.pdf');
                   
      if (isPdf) {
        console.log('Selected file:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });
        setUploadData(prev => ({ ...prev, file }));
      } else {
        alert('Please select a PDF file only.');
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadData.documentName.trim() || !uploadData.file) {
      alert('Please provide both document name and file.');
      return;
    }

    setIsLoading(true);
    const currentFile = uploadData.file; // Store reference before clearing
    const currentDocName = uploadData.documentName.trim();
    
    try {
      await PolicyDocsService.uploadDocument({
        documentName: currentDocName,
        file: currentFile
      }, fetchWithAuth, backendUrl);
      
      setShowUploadModal(false);
      setUploadData({ documentName: '', file: null });
      
      // Refresh documents list
      await fetchDocuments();
      
      // Store file size for the newly uploaded document
      const updatedDocs = await PolicyDocsService.getAllDocs(fetchWithAuth, backendUrl);
      const newDoc = updatedDocs.find(doc => doc.documentName === currentDocName);
      if (newDoc && currentFile) {
        storeFileSize(newDoc.id, currentFile.size);
      }
      
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to upload document: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, docName: string) => {
    if (!confirm(`Are you sure you want to delete "${docName}"?`)) return;

    setIsLoading(true);
    try {
      await PolicyDocsService.deleteDocument(id, fetchWithAuth, backendUrl);
      await fetchDocuments();
      alert('Document deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to delete document: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Store file sizes in localStorage for display (since backend doesn't return file size)
  const storeFileSize = (docId: number, size: number) => {
    try {
      const fileSizes = JSON.parse(localStorage.getItem('documentFileSizes') || '{}');
      fileSizes[docId] = size;
      localStorage.setItem('documentFileSizes', JSON.stringify(fileSizes));
    } catch (error) {
      console.error('Error storing file size:', error);
    }
  };

  const getStoredFileSize = (docId: number) => {
    try {
      const fileSizes = JSON.parse(localStorage.getItem('documentFileSizes') || '{}');
      return fileSizes[docId] || null;
    } catch (error) {
      console.error('Error getting stored file size:', error);
      return null;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button - Only visible when chat is closed */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen 
            ? 'opacity-0 scale-0 rotate-180 pointer-events-none' 
            : 'opacity-100 scale-100 rotate-0'
        }`}
      >
        <Button
          onClick={handleToggleChat}
          className="rounded-full w-14 h-14 flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 group"
        >
          <ChatIcon className="w-7 h-7 text-white transform transition-transform duration-300 group-hover:scale-110" />
          
          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 animate-ping opacity-20"></div>
        </Button>
      </div>

      {/* Chat/Settings Popup */}
      <div
        className={`absolute bottom-0 right-0 origin-bottom-right transition-all duration-500 ease-out ${
          isOpen
            ? 'transform scale-100 opacity-100 translate-y-0'
            : 'transform scale-0 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="w-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Sliding Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(${currentView === 'settings' ? '-100%' : '0%'})` }}
            >
              {/* Chat View */}
              <div className="min-w-full">
                {/* Chat Header */}
                <div className="relative py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <ChatIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Policy Chat Bot</h3>
                        <p className="text-blue-100 text-sm">Always here to help</p>
                      </div>
                    </div>
                    
                    {/* Close Button */}
                    <button
                      onClick={handleToggleChat}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
                


                {/* Chat Messages Area */}
                <div className="h-[480px] p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    <div className="flex items-start animate-fade-in">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                        <ChatIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl rounded-tl-sm p-4 max-w-[85%] border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                          👋 Hello! I'm your policy assistant. I can help you with:
                        </p>
                        <ul className="mt-2 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Company policies and procedures</li>
                          <li>• Leave and attendance guidelines</li>
                          <li>• IT and security protocols</li>
                          <li>• HR-related queries</li>
                        </ul>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                          How can I assist you today?
                        </p>
                      </div>
                    </div>

                    {/* Chat History */}
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`${msg.messageType === 'user' ? 'flex justify-end' : ''}`}>
                        {/* Document Citation - Above Assistant Response */}
                        {msg.messageType === 'assistant' && msg.metadata?.citations && msg.metadata.citations.length > 0 && (
                          <div className="mb-2 ml-11">
                            {msg.metadata.citations.map((citation: any, citIndex: number) => (
                              <div key={citIndex} className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 flex-shrink-0 text-blue-500 dark:text-blue-400">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14,2 14,8 20,8" />
                                </svg>
                                <span className="font-medium truncate max-w-[200px]" style={{ fontFamily: 'Inter' }}>
                                  {citation.title}
                                </span>
                                {citation.page && (
                                  <span className="ml-2 text-gray-500 dark:text-gray-500 flex-shrink-0">
                                    • Page {citation.page}
                                  </span>
                                )}
                                <a
                                  href={citation.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 flex-shrink-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15,3 21,3 21,9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className={`flex items-start ${msg.messageType === 'user' ? 'justify-end' : ''}`}>
                        {msg.messageType === 'assistant' && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                            <ChatIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`rounded-2xl p-4 max-w-[85%] ${
                          msg.messageType === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm ml-auto'
                            : `bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-100 dark:border-blue-800 rounded-tl-sm ${
                                msg.metadata?.error ? 'border-red-300 dark:border-red-700' : ''
                              }`
                        }`}>


                          <p className={`text-sm leading-relaxed ${
                            msg.messageType === 'user' 
                              ? 'text-white' 
                              : msg.metadata?.error 
                                ? 'text-red-800 dark:text-red-200'
                                : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {msg.content}
                          </p>
                          {msg.metadata?.timestamp && (
                            <p className={`text-xs mt-1 opacity-75 ${
                              msg.messageType === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {formatTime(msg.metadata.timestamp)}
                            </p>
                          )}
                        </div>
                        {msg.messageType === 'user' && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center ml-3">
                            <span className="text-white text-xs font-semibold">You</span>
                          </div>
                        )}
                      </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isSending && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                          <ChatIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl rounded-tl-sm p-4 border border-blue-100 dark:border-blue-800">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about policies..."
                      disabled={isSending || !isAuthenticated}
                      className="w-full px-4 py-3 pr-32 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <button
                        onClick={handleSettingsClick}
                        className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
                      >
                        <SettingsIcon />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isSending || !isAuthenticated}
                        className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <SendIcon />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <div className={`w-2 h-2 ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2 animate-pulse`}></div>
                      <span>{isAuthenticated ? 'AI Assistant Online' : 'Please login to use chat'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings View */}
              <div className="min-w-full">
                {/* Settings Header */}
                <div className="relative py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleBackToChat}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                      >
                        <BackIcon />
                      </button>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Document Management</h3>
                        <p className="text-blue-100 text-sm">Manage policy documents</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleToggleChat}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                {/* Search and Add Section */}
                <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    >
                      <PlusIcon />
                      Add New
                    </button>
                  </div>
                </div>

                {/* Documents List */}
                <div className="h-[440px] overflow-y-auto bg-gray-50 dark:bg-gray-800">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : filteredDocuments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <DocumentIcon className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm">
                        {searchQuery ? 'No documents found' : 'No documents uploaded yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {filteredDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                          style={{ fontFamily: 'Open Sans' }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              {/* Document Title */}
                              <h4 
                                className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate"
                                style={{ 
                                  fontFamily: 'Open Sans',
                                  fontWeight: 600,
                                  fontSize: '16px',
                                  lineHeight: '100%',
                                  letterSpacing: '0%',
                                  verticalAlign: 'middle'
                                }}
                              >
                                {doc.documentName}
                              </h4>
                              
                              {/* Author Information */}
                              <div 
                                className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2"
                                style={{ 
                                  fontFamily: 'Open Sans',
                                  lineHeight: '100%',
                                  letterSpacing: '0%',
                                  verticalAlign: 'middle'
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span>By: Admin Office</span>
                              </div>
                              
                              {/* File Type and Size */}
                              <div 
                                className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                                style={{ 
                                  fontFamily: 'Open Sans',
                                  lineHeight: '100%',
                                  letterSpacing: '0%',
                                  verticalAlign: 'middle'
                                }}
                              >
                                <DocumentIcon className="w-4 h-4 mr-2" />
                                <span className="font-medium">PDF</span>
                                {(() => {
                                  const fileSize = getStoredFileSize(doc.id);
                                  return fileSize ? (
                                    <>
                                      <span className="mx-2">•</span>
                                      <span>{formatFileSize(fileSize)}</span>
                                    </>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3 ml-4">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                                title="View document"
                                style={{ 
                                  fontFamily: 'Open Sans',
                                  lineHeight: '100%',
                                  letterSpacing: '0%',
                                  verticalAlign: 'middle'
                                }}
                              >
                                View
                                <span className="ml-1.5">
                                  <ExternalLinkIcon />
                                </span>
                              </a>
                              <button
                                onClick={() => handleDelete(doc.id, doc.documentName)}
                                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                title="Delete document"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Upload Policy Document
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={uploadData.documentName}
                    onChange={(e) => setUploadData(prev => ({ ...prev, documentName: e.target.value }))}
                    placeholder="Enter document name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PDF File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {uploadData.file && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Selected: {uploadData.file.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadData({ documentName: '', file: null });
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadData.documentName.trim() || !uploadData.file || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 