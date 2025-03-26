'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QueryHistory } from '../../types';
import { queryAI, getQueryHistory, searchChronicles } from '../../services/api';

export default function AIAssistant() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFeatAvailable, setIsFeatAvailable] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getQueryHistory();
      
      if (response.success) {
        setHistory(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch history');
        
        // If the API isn't available yet
        if (response.error?.includes('not yet available') || 
            response.error?.includes('endpoint not found')) {
          setIsFeatAvailable(false);
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load query history');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // First try direct search to see if backend search route is available
      const searchResponse = await searchChronicles(query);
      
      if (searchResponse.success) {
        // Try the AI query endpoint if search was successful
        const response = await queryAI(query);
        
        if (response.success && response.data) {
          const newQuery: QueryHistory = {
            id: Date.now().toString(),
            query: query,
            response: response.data,
            timestamp: new Date().toISOString(),
            userId: '',
          };
          setHistory(current => [newQuery, ...current]);
          setQuery('');
        } else {
          setError(response.error || 'Failed to get response from AI');
          
          // If the API isn't available yet
          if (response.error?.includes('not yet available') || 
              response.error?.includes('endpoint not found')) {
            setIsFeatAvailable(false);
          }
          
          // If authentication required, redirect to login
          if (response.error?.includes('Authentication required')) {
            router.push('/login');
          }
        }
      } else {
        // Check if this is an authentication issue
        if (searchResponse.error?.includes('Authentication required')) {
          router.push('/login');
        } else {
          setError('Search service is not available right now');
          setIsFeatAvailable(false);
        }
      }
    } catch (error) {
      console.error('Error querying AI:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFeatAvailable) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-[#3B1C32] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            AI Assistant Coming Soon
          </h2>
          <p className="text-gray-300 mb-6">
            The AI assistant feature is currently in development and will be available soon. 
            Check back later to interact with your chronicles using AI.
          </p>
          <div className="w-24 h-24 rounded-full bg-[#6A1E55] flex items-center justify-center mx-auto">
            <span className="text-4xl">🤖</span>
          </div>
          {error && (
            <div className="mt-6 p-4 bg-[#1A1A1D] rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-300 mb-6">AI Assistant</h1>
      
      <div className="bg-[#3B1C32] rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-2">
              Ask a question about your chronicles
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#1A1A1D] border border-[#6A1E55] rounded-md text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#A64D79] focus:border-[#A64D79]"
              placeholder="What insights can you provide from my chronicles about..."
              rows={3}
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-red-500">{error}</div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 py-2 bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] text-white rounded-md hover:opacity-90 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Ask Question'}
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold text-gray-300 mb-4">Query History</h2>

      <div className="space-y-6">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-[#3B1C32] rounded-lg p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 font-medium">Q:</span>
                <p className="text-gray-300">{item.query}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-start space-x-2 pl-6">
              <span className="text-[#A64D79] font-medium">A:</span>
              <div className="flex-1">
                <p className="text-gray-300 whitespace-pre-wrap">{item.response}</p>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 py-8">
            <p>No questions asked yet. Start by asking something above!</p>
          </div>
        )}
      </div>
    </div>
  );
} 