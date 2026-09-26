import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';
import {
  initChromeDB,
  saveUserToChromeDB,
  getUserFromChromeDB,
  updateUserPasswordInChromeDB,
  authenticateWithMCPModel,
  saveSessionToChromeDB,
  getActiveSessionFromChromeDB,
  clearSessionFromChromeDB,
} from '../services/chromeDatabase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [mcpSession, setMcpSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate existing token and restore session from Chrome Database & Local Storage
  const checkAuth = useCallback(async () => {
    try {
      await initChromeDB();
      const chromeSession = await getActiveSessionFromChromeDB();

      if (chromeSession && chromeSession.user && chromeSession.token) {
        setUser(chromeSession.user);
        setToken(chromeSession.token);
        setMcpSession(chromeSession.mcpAuth);
        localStorage.setItem('token', chromeSession.token);
        localStorage.setItem('user', JSON.stringify(chromeSession.user));
        setLoading(false);
        return;
      }

      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setUser(null);
        setToken(null);
        setMcpSession(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();
        setUser(userData);
        setToken(savedToken);
      } catch (err) {
        console.warn('Backend session validation:', err?.message);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setToken(savedToken);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
    } catch (err) {
      console.warn('Auth restoration error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Log in user with credentials, MCP Model authentication, and Chrome Database storage
   */
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    let authenticatedUser = null;
    let accessToken = null;

    try {
      // 1. Attempt Backend API authentication
      const backendData = await authService.login({ email: cleanEmail, password });
      authenticatedUser = backendData.user;
      accessToken = backendData.access_token;
    } catch (backendError) {
      console.warn('Backend API login unavailable or rejected, checking Chrome Database:', backendError?.message);
      
      // 2. Fallback to Chrome Database
      const localUser = await getUserFromChromeDB(cleanEmail);
      if (localUser && (!localUser.password || localUser.password === password)) {
        authenticatedUser = {
          id: localUser.id || Date.now(),
          email: localUser.email,
          full_name: localUser.full_name || cleanEmail.split('@')[0],
          is_active: true,
        };
        accessToken = `chrome_jwt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      } else {
        throw new Error(
          backendError?.response?.data?.detail ||
          (localUser ? 'Incorrect password for this account.' : 'Account not found. Please sign up.')
        );
      }
    }

    // 3. Authenticate with MCP Model Security Layer
    const mcpAuth = await authenticateWithMCPModel(cleanEmail);
    setMcpSession(mcpAuth);

    // 4. Save to Chrome Database (IndexedDB)
    await saveUserToChromeDB({
      ...authenticatedUser,
      password,
      last_login: new Date().toISOString(),
    });
    await saveSessionToChromeDB(authenticatedUser, accessToken, mcpAuth);

    // 5. Update local storage and app state
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    setToken(accessToken);
    setUser(authenticatedUser);

    return authenticatedUser;
  };

  /**
   * Register new user account with Chrome Database and MCP Model
   */
  const register = async (fullName, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    let registeredUser = null;
    let accessToken = null;

    try {
      // 1. Attempt Backend API registration
      const backendData = await authService.register({
        full_name: fullName,
        email: cleanEmail,
        password,
      });
      registeredUser = backendData.user;
      accessToken = backendData.access_token;
    } catch (backendError) {
      console.warn('Backend API register fallback to Chrome Database:', backendError?.message);

      // 2. Create in Chrome Database
      registeredUser = {
        id: Date.now(),
        email: cleanEmail,
        full_name: fullName,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      accessToken = `chrome_jwt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }

    // 3. Authenticate with MCP Model Security Layer
    const mcpAuth = await authenticateWithMCPModel(cleanEmail);
    setMcpSession(mcpAuth);

    // 4. Persist in Chrome Database (IndexedDB)
    await saveUserToChromeDB({
      ...registeredUser,
      password,
      created_at: new Date().toISOString(),
    });
    await saveSessionToChromeDB(registeredUser, accessToken, mcpAuth);

    // 5. Update state & storage
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    setToken(accessToken);
    setUser(registeredUser);

    return registeredUser;
  };

  /**
   * Reset password in Chrome Database
   */
  const resetPassword = async (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
    const updated = await updateUserPasswordInChromeDB(cleanEmail, newPassword);
    return updated;
  };

  /**
   * Log out user and clean up session in Chrome Database & Local Storage
   */
  const logout = async () => {
    await clearSessionFromChromeDB();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setMcpSession(null);
  };

  const value = {
    user,
    token,
    mcpSession,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    resetPassword,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
