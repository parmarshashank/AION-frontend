'use client';

import { useState, useEffect } from 'react';
import { Chronicle } from '../types';
import { getChronicles, createChronicle, updateChronicle, deleteChronicle } from '../services/api';
import CreateChronicleModal from '../components/CreateChronicleModal';

export default function Dashboard() {
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [selectedChronicle, setSelectedChronicle] = useState<Chronicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChronicles();
  }, []);

  const fetchChronicles = async () => {
    setIsLoading(true);
    const response = await getChronicles();
    if (response.success && response.data) {
      setChronicles(response.data);
    } else {
      setError(response.error || 'Failed to fetch chronicles');
    }
    setIsLoading(false);
  };

  const handleCreateChronicle = async (chronicle: Partial<Chronicle>) => {
    const response = await createChronicle(chronicle);
    if (response.success && response.data) {
      setChronicles(current => [...current, response.data!]);
      setIsModalOpen(false);
    } else {
      setError(response.error || 'Failed to create chronicle');
    }
  };

  const handleUpdateChronicle = async (chronicle: Partial<Chronicle>) => {
    if (!selectedChronicle) return;
    const response = await updateChronicle(selectedChronicle.id, chronicle);
    if (response.success && response.data) {
      setChronicles(current => current.map(c => c.id === selectedChronicle.id ? response.data! : c));
      setSelectedChronicle(response.data);
      setIsModalOpen(false);
      setIsEditing(false);
    } else {
      setError(response.error || 'Failed to update chronicle');
    }
  };

  const handleDeleteChronicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this chronicle?')) {
      const response = await deleteChronicle(id);
      if (response.success) {
        setChronicles(current => current.filter(c => c.id !== id));
        if (selectedChronicle?.id === id) {
          setSelectedChronicle(null);
        }
      } else {
        setError(response.error || 'Failed to delete chronicle');
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 bg-[#3B1C32] border-r border-[#6A1E55] p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-300">Chronicles</h2>
          <button
            onClick={() => {
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="p-2 text-gray-300 hover:text-[#A64D79]"
          >
            + New
          </button>
        </div>

        {isLoading ? (
          <div className="text-gray-300">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="space-y-2">
            {chronicles.map((chronicle) => (
              <div
                key={chronicle.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedChronicle?.id === chronicle.id
                    ? 'bg-[#6A1E55] text-white'
                    : 'text-gray-300 hover:bg-[#6A1E55]/50'
                }`}
                onClick={() => setSelectedChronicle(chronicle)}
              >
                <div className="font-medium">{chronicle.title}</div>
                <div className="text-sm opacity-75 truncate">{chronicle.content}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {chronicle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#A64D79]/30 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedChronicle ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-300">{selectedChronicle.title}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1 text-gray-300 border border-[#6A1E55] rounded hover:border-[#A64D79]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteChronicle(selectedChronicle.id)}
                  className="px-3 py-1 text-red-400 border border-red-400/50 rounded hover:bg-red-400/10"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 whitespace-pre-wrap">{selectedChronicle.content}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedChronicle.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-[#6A1E55] text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-300 mt-20">
            <h3 className="text-xl font-medium">No Chronicle Selected</h3>
            <p className="mt-2">Select a chronicle from the sidebar or create a new one</p>
          </div>
        )}
      </div>

      <CreateChronicleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditing(false);
        }}
        onSubmit={isEditing ? handleUpdateChronicle : handleCreateChronicle}
        initialData={isEditing && selectedChronicle ? selectedChronicle : undefined}
      />
    </div>
  );
} 