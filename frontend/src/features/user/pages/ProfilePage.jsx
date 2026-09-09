import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '../hooks/useUserProfile.js';
import './ProfilePage.css';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

const ProfilePage = () => {
  const { profile, loading, error, updateUserProfile } = useUserProfile();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    values: profile, // Pre-fill form with profile data
  });

  const onSubmit = (data) => {
    updateUserProfile(data);
  };

  if (loading && !profile) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        <div className="form-group">
          <label>First Name</label>
          <input {...register('firstName')} />
          {errors.firstName && <p className="error">{errors.firstName.message}</p>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input {...register('lastName')} />
          {errors.lastName && <p className="error">{errors.lastName.message}</p>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register('email')} disabled />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
