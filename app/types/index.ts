export interface Chronicle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  referenceLinks?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  userId: string;
}

export interface QueryHistory {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  userId: string;
}

export interface SharedCollection {
  id: string;
  chronicles: Chronicle[];
  isPublic: boolean;
  createdAt: string;
  userId: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  relevanceScore: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 