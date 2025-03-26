const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends UserCredentials {
  name: string;
}

const setTokenCookie = (token: string) => {
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict`;
};

const removeTokenCookie = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const login = async (credentials: UserCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'Invalid credentials',
      };
    }

    if (data.token) {
      setTokenCookie(data.token);
      return data;
    }

    return {
      error: 'Invalid response from server',
    };
  } catch (error) {
    return {
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
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'Failed to create account',
      };
    }

    if (data.token) {
      setTokenCookie(data.token);
      return data;
    }

    return {
      error: 'Invalid response from server',
    };
  } catch (error) {
    return {
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
      },
      credentials: 'include',
    });

    removeTokenCookie();

    if (response.ok) {
      return { };
    }

    const data = await response.json();
    return {
      error: data.error || 'Failed to logout',
    };
  } catch (error) {
    removeTokenCookie();
    return { };
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.cookie.includes('token=');
}; 