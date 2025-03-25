const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends UserCredentials {
  name: string;
}

export const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during login. Please try again.',
    };
  }
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during signup. Please try again.',
    };
  }
};

export const logout = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      localStorage.removeItem('token');
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred during logout. Please try again.',
    };
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}; 