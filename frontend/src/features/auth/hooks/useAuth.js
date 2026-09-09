/**
 * Authentication Hooks
 */

import { useSelector, useDispatch } from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectAuthLoading,
  selectAuthError,
  selectSessionId,
} from '../store/authSelectors.js';
import { loginUser, signupUser, logoutUser, verifyAuth } from '../store/authSlice.js';

/**
 * useAuth Hook
 * Get current auth state
 */
export function useAuth() {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const sessionId = useSelector(selectSessionId);

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    sessionId,
  };
}

/**
 * useLogin Hook
 * Login user
 */
export function useLogin() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    return result.payload;
  };

  return { login, loading, error, isAuthenticated };
}

/**
 * useSignup Hook
 * Sign up user
 */
export function useSignup() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const signup = async (name, email, password) => {
    const result = await dispatch(signupUser({ name, email, password }));
    return result.payload;
  };

  return { signup, loading, error, isAuthenticated };
}

/**
 * useLogout Hook
 * Logout user
 */
export function useLogout() {
  const dispatch = useDispatch();

  const logout = async () => {
    await dispatch(logoutUser());
  };

  return { logout };
}

/**
 * useAuthInit Hook
 * Initialize auth on app startup
 */
export function useAuthInit() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);

  const initializeAuth = async () => {
    await dispatch(verifyAuth());
  };

  return { initializeAuth, loading };
}

