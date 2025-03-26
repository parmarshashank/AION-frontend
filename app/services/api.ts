import { Chronicle, Link, QueryHistory, SharedCollection, SearchResult, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006';

const getHeaders = () => {
  let token = '';
  
  // Get token from cookie
  if (typeof document !== 'undefined') {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
    }
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper to handle API responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (response.status === 401) {
    return { success: false, error: 'Authentication required. Please log in again.' };
  }

  if (response.status === 404) {
    return { success: false, error: 'API endpoint not found' };
  }

  if (!response.ok) {
    try {
      const errorData = await response.json();
      return { success: false, error: errorData.error || `Error: ${response.status}` };
    } catch (e) {
      return { success: false, error: `Request failed with status ${response.status}` };
    }
  }

  try {
    const data = await response.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: 'Failed to parse response' };
  }
};

// Chronicles
export const getChronicles = async (): Promise<ApiResponse<Chronicle[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/chronicles`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    
    return handleResponse<Chronicle[]>(response);
  } catch (error) {
    console.error('API error:', error);
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
    
    const result = await handleResponse<Chronicle>(response);
    
    // Special case: If there's a Qdrant error but the chronicle was created
    if (!result.success && response.status === 500 && 
        (response.statusText.includes('Qdrant') || response.statusText.includes('Forbidden'))) {
      
      // Try to get the created chronicle from the response body
      try {
        const data = await response.json();
        if (data && data.id) {
          console.warn('Chronicle created but Qdrant indexing failed');
          return { 
            success: true, 
            data: data as Chronicle,
            error: 'Chronicle created but search indexing failed. Search may be limited.'
          };
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    return result;
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to create chronicle' };
  }
};

export const updateChronicle = async (id: string, chronicle: Partial<Chronicle>): Promise<ApiResponse<Chronicle>> => {
  try {
    // Note: Checking if backend supports PUT
    const response = await fetch(`${API_URL}/api/chronicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(chronicle),
      credentials: 'include',
    });
    
    return handleResponse<Chronicle>(response);
  } catch (error) {
    console.error('API error:', error);
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
    
    if (response.ok) {
      return { success: true };
    }
    
    return handleResponse<void>(response);
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to delete chronicle' };
  }
};

// Search
export const searchChronicles = async (query: string): Promise<ApiResponse<SearchResult[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/chronicles/search?query=${encodeURIComponent(query)}`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    
    // If the search endpoint returns a 500 with a Qdrant error, try the query endpoint
    if (response.status === 500) {
      try {
        const errorText = await response.text();
        if (errorText.includes('Qdrant') || errorText.includes('Forbidden')) {
          console.warn('Qdrant search failed, trying direct query endpoint');
          
          // Try the new endpoint for direct querying
          const queryResponse = await fetch(`${API_URL}/api/search/query`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ question: query }),
            credentials: 'include',
          });
          
          if (queryResponse.ok) {
            return handleResponse<SearchResult[]>(queryResponse);
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    return handleResponse<SearchResult[]>(response);
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to search chronicles' };
  }
};

// These functions are mocked since the backend doesn't have these routes yet
// They'll return empty data until the backend implements them

// Query History - Mock
export const getQueryHistory = async (): Promise<ApiResponse<QueryHistory[]>> => {
  try {
    // First try the real endpoint
    const response = await fetch(`${API_URL}/api/search/history`, {
      headers: getHeaders(),
      credentials: 'include',
    });
    
    if (response.ok) {
      return handleResponse<QueryHistory[]>(response);
    }
    
    console.warn('Warning: getQueryHistory API endpoint not implemented on backend');
    return { 
      success: true, 
      data: [] 
    };
  } catch (error) {
    console.warn('Warning: getQueryHistory API endpoint error', error);
    return { 
      success: true, 
      data: [] 
    };
  }
};

// AI Queries
export const queryAI = async (query: string): Promise<ApiResponse<string>> => {
  try {
    // Try the direct query endpoint
    const response = await fetch(`${API_URL}/api/search/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ question: query }),
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.answer) {
        return { 
          success: true, 
          data: typeof data.answer === 'string' ? data.answer : data.answer.answer
        };
      }
    }
    
    // Fall back to mock if the endpoint isn't available
    console.warn('Warning: queryAI API endpoint not implemented on backend or failed');
    return { 
      success: true, 
      data: "The AI assistant couldn't process your question due to a technical issue. Please try again later." 
    };
  } catch (error) {
    console.warn('Warning: queryAI API endpoint error', error);
    return { 
      success: false, 
      error: 'The AI service is currently unavailable. Please try again later.'
    };
  }
};

// Links - Mock
export const getLinks = async (): Promise<ApiResponse<Link[]>> => {
  console.warn('Warning: getLinks API endpoint not implemented on backend');
  return { 
    success: true, 
    data: [] 
  };
};

export const createLink = async (link: Partial<Link>): Promise<ApiResponse<Link>> => {
  console.warn('Warning: createLink API endpoint not implemented on backend');
  return { 
    success: false, 
    error: 'This feature is not yet available' 
  };
};

export const deleteLink = async (id: string): Promise<ApiResponse<void>> => {
  console.warn('Warning: deleteLink API endpoint not implemented on backend');
  return { 
    success: false, 
    error: 'This feature is not yet available' 
  };
};

// Shared Collections - Mock
export const shareChronicles = async (chronicleIds: string[]): Promise<ApiResponse<SharedCollection>> => {
  console.warn('Warning: shareChronicles API endpoint not implemented on backend');
  return { 
    success: false, 
    error: 'This feature is not yet available' 
  };
}; 