'use client';

import { useState, useEffect } from 'react';
import { QueryHistory } from '../../types';
import { queryAI, getQueryHistory } from '../../services/api';

export default function AIAssistant() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const response = await getQueryHistory();
    if (response.success && response.data) {
      setHistory(response.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

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
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-300 mb-4">AI Assistant</h1>
        <p className="text-gray-400">
          Ask questions about your stored knowledge and get AI-powered answers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your knowledge base..."
            className="flex-1 px-4 py-3 bg-[#3B1C32] border border-[#6A1E55] rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#A64D79] focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </form>

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