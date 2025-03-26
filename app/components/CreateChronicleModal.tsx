'use client';

import { useState } from 'react';
import { Chronicle } from '../types';

interface CreateChronicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (chronicle: Partial<Chronicle>) => Promise<void>;
  initialData?: Chronicle;
}

export default function CreateChronicleModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateChronicleModalProps) {
  const [formData, setFormData] = useState<Partial<Chronicle>>(
    initialData || {
      title: '',
      content: '',
      tags: [],
    }
  );
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
    onClose();
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...(formData.tags || []), tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#3B1C32] rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">
          {initialData ? 'Edit Chronicle' : 'Create New Chronicle'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full px-3 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-md text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#A64D79] focus:border-[#A64D79]"
              placeholder="Enter chronicle title"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="mt-1 block w-full px-3 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-md text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#A64D79] focus:border-[#A64D79]"
              placeholder="Enter chronicle content"
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
              Tags (Press Enter to add)
            </label>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="mt-1 block w-full px-3 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-md text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#A64D79] focus:border-[#A64D79]"
              placeholder="Add tags..."
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-[#6A1E55] text-gray-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-[#A64D79] focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#6A1E55] rounded-md text-gray-300 hover:border-[#A64D79] focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] text-white rounded-md hover:opacity-90 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Chronicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 