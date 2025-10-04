import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  institution?: string;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: undefined,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: 'SET_TOKEN', payload: token });
          dispatch({ type: 'SET_USER', payload: user });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulate API call - replace with actual API
      const response = await simulateLogin(email, password);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulate API call - replace with actual API
      const response = await simulateSignup(userData);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!state.user) throw new Error('No user logged in');
      
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulate API call - replace with actual API
      const response = await simulateUpdateProfile(state.user.id, userData);
      
      if (response.success) {
        const updatedUser = { ...state.user, ...response.data };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        dispatch({ type: 'SET_USER', payload: updatedUser });
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call - replace with actual API
      const response = await simulateResetPassword(email);
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API functions - replace with actual API calls
const simulateLogin = async (email: string, password: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'admin@example.com' && password === 'admin123') {
    return {
      success: true,
      data: {
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin' as UserRole,
          status: 'active' as const,
          department: 'Computer Science',
          institution: 'Tech University',
          avatar: '',
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        token: 'mock_jwt_token_' + Date.now(),
      },
    };
  }
  
  if (email === 'faculty@example.com' && password === 'faculty123') {
    return {
      success: true,
      data: {
        user: {
          id: '2',
          email: 'faculty@example.com',
          name: 'Faculty Member',
          role: 'faculty' as UserRole,
          status: 'active' as const,
          department: 'Computer Science',
          institution: 'Tech University',
          avatar: '',
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        token: 'mock_jwt_token_' + Date.now(),
      },
    };
  }
  
  if (email === 'student@example.com' && password === 'student123') {
    return {
      success: true,
      data: {
        user: {
          id: '3',
          email: 'student@example.com',
          name: 'Student User',
          role: 'student' as UserRole,
          status: 'active' as const,
          department: 'Computer Science',
          institution: 'Tech University',
          avatar: '',
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        token: 'mock_jwt_token_' + Date.now(),
      },
    };
  }
  
  return {
    success: false,
    message: 'Invalid email or password',
  };
};

const simulateSignup = async (userData: SignupData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (userData.email && userData.password && userData.name) {
    return {
      success: true,
      data: {
        user: {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name,
          role: userData.role,
          status: 'active' as const,
          department: userData.department,
          institution: userData.institution,
          avatar: '',
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        token: 'mock_jwt_token_' + Date.now(),
      },
    };
  }
  
  return {
    success: false,
    message: 'Invalid signup data',
  };
};

const simulateUpdateProfile = async (userId: string, userData: Partial<User>) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: userData,
  };
};

const simulateResetPassword = async (email: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: 'Password reset email sent',
  };
};

