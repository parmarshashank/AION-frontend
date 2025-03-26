'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chronicle } from '../types';
import { getChronicles, createChronicle, updateChronicle, deleteChronicle } from '../services/api';
import CreateChronicleModal from '../components/CreateChronicleModal';

export default function Dashboard() {
  const router = useRouter();
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
    setError('');
    
    try {
      const response = await getChronicles();
      
      if (response.success && response.data) {
        // Ensure data is an array before setting it
        const chroniclesData = Array.isArray(response.data) ? response.data : [];
        setChronicles(chroniclesData);
        
        if (chroniclesData.length > 0 && !selectedChronicle) {
          setSelectedChronicle(chroniclesData[0]);
        }
      } else {
        setError(response.error || 'Failed to fetch chronicles');
        
        // If unauthorized, redirect to login
        if (response.error?.includes('Authentication required')) {
          router.push('/login');
        }
      }
    } catch (error) {
      setError('An error occurred while fetching chronicles');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChronicle = async (chronicle: Partial<Chronicle>) => {
    setError('');
    try {
      const response = await createChronicle(chronicle);
      if (response.success && response.data) {
        setChronicles(current => [...current, response.data!]);
        setSelectedChronicle(response.data);
        setIsModalOpen(false);
        
        // Show warning if there was a partial success (chronicle created but search indexing failed)
        if (response.error) {
          setError(response.error);
        }
      } else {
        setError(response.error || 'Failed to create chronicle');
        
        // If unauthorized, redirect to login
        if (response.error?.includes('Authentication required')) {
          router.push('/login');
        }
      }
    } catch (error) {
      setError('An error occurred while creating chronicle');
      console.error(error);
    }
  };

  const handleUpdateChronicle = async (chronicle: Partial<Chronicle>) => {
    if (!selectedChronicle) return;
    setError('');
    
    try {
      const response = await updateChronicle(selectedChronicle.id, chronicle);
      if (response.success && response.data) {
        setChronicles(current => current.map(c => c.id === selectedChronicle.id ? response.data! : c));
        setSelectedChronicle(response.data);
        setIsModalOpen(false);
        setIsEditing(false);
      } else {
        setError(response.error || 'Failed to update chronicle');
        
        // If unauthorized, redirect to login
        if (response.error?.includes('Authentication required')) {
          router.push('/login');
        }
      }
    } catch (error) {
      setError('An error occurred while updating chronicle');
      console.error(error);
    }
  };

  const handleDeleteChronicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this chronicle?')) {
      setError('');
      
      try {
        const response = await deleteChronicle(id);
        if (response.success) {
          setChronicles(current => current.filter(c => c.id !== id));
          if (selectedChronicle?.id === id) {
            setSelectedChronicle(chronicles.length > 1 ? 
              chronicles.find(c => c.id !== id) || null : null);
          }
        } else {
          setError(response.error || 'Failed to delete chronicle');
          
          // If unauthorized, redirect to login
          if (response.error?.includes('Authentication required')) {
            router.push('/login');
          }
        }
      } catch (error) {
        setError('An error occurred while deleting chronicle');
        console.error(error);
      }
    }
  };

  // Retry loading if there was an error
  const handleRetry = () => {
    fetchChronicles();
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
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-300">Loading chronicles...</div>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-[#6A1E55] text-white rounded-md hover:bg-[#A64D79]"
            >
              Retry
            </button>
          </div>
        ) : chronicles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-300 mb-4">No chronicles found.</div>
            <button
              onClick={() => {
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-[#6A1E55] text-white rounded-md hover:bg-[#A64D79]"
            >
              Create Your First Chronicle
            </button>
          </div>
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
                  {chronicle.tags && Array.isArray(chronicle.tags) ? chronicle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#A64D79]/30 text-gray-300"
                    >
                      {tag}
                    </span>
                  )) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-300">Loading chronicle details...</div>
          </div>
        ) : error && chronicles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-[#6A1E55] text-white rounded-md hover:bg-[#A64D79]"
              >
                Retry
              </button>
            </div>
          </div>
        ) : selectedChronicle ? (
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
            
            {/* Tags */}
            {selectedChronicle.tags && Array.isArray(selectedChronicle.tags) && selectedChronicle.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
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
            )}
            
            {/* Reference Links */}
            {selectedChronicle.referenceLinks && Array.isArray(selectedChronicle.referenceLinks) && selectedChronicle.referenceLinks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Reference Links</h3>
                <div className="space-y-2">
                  {selectedChronicle.referenceLinks.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-md text-gray-300 hover:bg-[#3B1C32] transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
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