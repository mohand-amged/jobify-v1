import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, users } from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await users.getProfile();
          if (response.data.user) {
            setUser({
              ...response.data.user,
              name: response.data.user.name || `${response.data.user.firstName} ${response.data.user.lastName}`.trim()
            });
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { email, password } = credentials;
      const response = await auth.login({ email, password });
      
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        
        // Get full user profile after login
        const profileResponse = await users.getProfile();
        if (profileResponse.data.data?.user) {
          const userData = {
            ...profileResponse.data.data.user,
            name: profileResponse.data.data.user.name || 
                  `${profileResponse.data.data.user.firstName} ${profileResponse.data.data.user.lastName}`.trim()
          };
          setUser(userData);
          showToast('Successfully logged in!', 'success');
          return { token, user: userData };
        }
        
        setUser(user);
        showToast('Successfully logged in!', 'success');
        return { token, user };
      } else {
        throw new Error(response.data.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      showToast(message, 'error');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await auth.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      // Format user data consistently
      const formattedUser = {
        ...user,
        name: user.name || `${user.firstName} ${user.lastName}`.trim()
      };
      
      setUser(formattedUser);
      showToast('Successfully registered!', 'success');
      return { success: true, user: formattedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      showToast('Successfully logged out', 'success');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await users.updateProfile(profileData);
      const updatedUser = {
        ...response.data,
        name: response.data.name || `${response.data.firstName} ${response.data.lastName}`.trim()
      };
      setUser(updatedUser);
      showToast('Profile updated successfully!', 'success');
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      await users.updateProfile({ password: passwordData });
      showToast('Password updated successfully!', 'success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password';
      showToast(message, 'error');
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 