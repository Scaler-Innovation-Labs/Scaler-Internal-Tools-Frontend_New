import { useState } from 'react';
import { DocumentPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/primitives/modal';

interface CreateDocumentFormProps {
  onClose: () => void;
  fileFormats: string[];
  categories: string[];
  tags: string[];
  allowedUserRoles: string[];
  allowedUserBatches: string[];
  defaultSelected: string[];
}

export function CreateDocumentForm({
  onClose,
  fileFormats,
  categories,
  tags,
  allowedUserRoles,
  allowedUserBatches,
  defaultSelected
}: CreateDocumentFormProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showNewTag, setShowNewTag] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(defaultSelected);

  const handleUserToggle = (user: string) => {
    setSelectedUsers(prev => 
      prev.includes(user) 
        ? prev.filter(u => u !== user)
        : [...prev, user]
    );
  };

  return (
    <Modal
      id="create-document"
      isOpen={true}
      onClose={onClose}
      className="w-full max-w-2xl flex flex-col max-h-[90vh]"
    >
      {/* Header */}
      <div className="bg-blue-600 p-4 rounded-t-xl flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-white">Create New Document</h2>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 space-y-6 overflow-y-auto flex-grow [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-blue-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-700">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <DocumentPlusIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Drag and drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported Formats: {fileFormats.join(', ')}
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={() => setShowNewCategory(true)}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            + Add New Category
          </button>

          {showNewCategory && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
                className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add
              </button>
            </div>
          )}
        </div>

        {/* Tags Selection */}
        <div className="space-y-2">
          <select 
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select Tag</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          <button
            onClick={() => setShowNewTag(true)}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            + Add New Tag
          </button>

          {showNewTag && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter new tag"
                className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add
              </button>
            </div>
          )}
        </div>

        {/* Allowed Users */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Allowed Users</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {allowedUserRoles.map(role => (
              <label key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(role)}
                  onChange={() => handleUserToggle(role)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{role}</span>
              </label>
            ))}
            {allowedUserBatches.map(batch => (
              <label key={batch} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(batch)}
                  onChange={() => handleUserToggle(batch)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{batch}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-3 flex-shrink-0">
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          Create
        </button>
      </div>
    </Modal>
  );
} 