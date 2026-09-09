/**
 * Signup Page
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import SignupForm from '../components/SignupForm.jsx';
import '../styles/AuthPage.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <SignupForm />
      </div>
    </div>
  );
}

