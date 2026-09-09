/**
 * Login Form Component
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { useLogin } from '../hooks/useAuth.js';
import { LoginSchema } from '../../../utils/validation/formValidations.js';
import './LoginForm.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setServerError('Invalid email or password');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Login to DrinkGo</h2>

      {(serverError || error) && (
        <div className="error-message">{serverError || error}</div>
      )}

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
          placeholder="Enter your password"
          {...register('password')}
          error={!!errors.password}
        />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <Button
        type="submit"
        loading={loading}
        fullWidth
      >
        Login
      </Button>

      <div className="form-footer">
        <a href="/auth/forgot-password">Forgot password?</a>
      </div>

      <div className="form-footer">
        Don't have an account? <a href="/auth/signup">Sign up</a>
      </div>
    </form>
  );
}

