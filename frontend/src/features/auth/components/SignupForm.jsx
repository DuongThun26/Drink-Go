/**
 * Signup Form Component
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { useSignup } from '../hooks/useAuth.js';
import { SignupSchema } from '../../../utils/validation/formValidations.js';
import './SignupForm.css';

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup, loading, error } = useSignup();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await signup(data.name, data.email, data.password);
      navigate('/');
    } catch (err) {
      setServerError('Sign up failed. Please try again.');
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Create Account</h2>

      {(serverError || error) && (
        <div className="error-message">{serverError || error}</div>
      )}

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          {...register('name')}
          error={!!errors.name}
        />
        {errors.name && <span className="field-error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          error={!!errors.email}
        />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password (min 6 characters)"
          {...register('password')}
          error={!!errors.password}
        />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <span className="field-error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <Button
        type="submit"
        loading={loading}
        fullWidth
      >
        Create Account
      </Button>

      <div className="form-footer">
        Already have an account? <a href="/auth/login">Login</a>
      </div>
    </form>
  );
}

