import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Login with email and password
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(email, password);
          set({
            user: response.user,
            token: response.token,
            loading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Login failed'
          });
          throw error;
        }
      },

      // Register with email and password
      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.register(name, email, password);
          set({
            user: response.user,
            token: response.token,
            loading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Registration failed'
          });
          throw error;
        }
      },

      // Google OAuth login
      loginWithGoogle: () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
      },

      // Handle OAuth callback
      handleOAuthCallback: (token) => {
        set({ token, loading: true });
        return get().checkAuth();
      },

      // Check authentication status
      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ loading: false });
          return;
        }

        set({ loading: true });
        try {
          const response = await authService.getCurrentUser();
          set({
            user: response.user,
            loading: false,
            error: null
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            loading: false,
            error: null
          });
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.updateProfile(profileData);
          set({
            user: response.user,
            loading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Profile update failed'
          });
          throw error;
        }
      },

      // Change password
      changePassword: async (currentPassword, newPassword) => {
        set({ loading: true, error: null });
        try {
          await authService.changePassword(currentPassword, newPassword);
          set({ loading: false, error: null });
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Password change failed'
          });
          throw error;
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          token: null,
          loading: false,
          error: null
        });
        // Clear any cached data
        localStorage.removeItem('auth-storage');
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
