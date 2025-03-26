import { Chronicle, Link, QueryHistory, SharedCollection, SearchResult, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

// Chronicles
export const getChronicles = async (): Promise<ApiResponse<Chronicle[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/chronicles`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch chronicles' };
  }
};

export const createChronicle = async (chronicle: Partial<Chronicle>): Promise<ApiResponse<Chronicle>> => {
  try {
    const response = await fetch(`${API_URL}/api/chronicles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(chronicle),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to create chronicle' };
  }
};

export const updateChronicle = async (id: string, chronicle: Partial<Chronicle>): Promise<ApiResponse<Chronicle>> => {
  try {
    const response = await fetch(`${API_URL}/api/chronicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(chronicle),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to update chronicle' };
  }
};

export const deleteChronicle = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_URL}/api/chronicles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete chronicle' };
  }
};

// Links
export const getLinks = async (): Promise<ApiResponse<Link[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/links`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch links' };
  }
};

export const createLink = async (link: Partial<Link>): Promise<ApiResponse<Link>> => {
  try {
    const response = await fetch(`${API_URL}/api/links`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(link),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to create link' };
  }
};

export const deleteLink = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_URL}/api/links/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete link' };
  }
};

// Shared Collections
export const shareChronicles = async (chronicleIds: string[]): Promise<ApiResponse<SharedCollection>> => {
  try {
    const response = await fetch(`${API_URL}/api/shared`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ chronicleIds }),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to share chronicles' };
  }
};

// Search
export const searchChronicles = async (query: string): Promise<ApiResponse<SearchResult[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to search chronicles' };
  }
};

// Query History
export const getQueryHistory = async (): Promise<ApiResponse<QueryHistory[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/ai/history`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch query history' };
  }
};

// AI Queries
export const queryAI = async (query: string): Promise<ApiResponse<string>> => {
  try {
    const response = await fetch(`${API_URL}/api/ai/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query }),
      credentials: 'include',
    });
    const data = await response.json();
    return { success: true, data: data.response };
  } catch (error) {
    return { success: false, error: 'Failed to query AI' };
  }
}; 