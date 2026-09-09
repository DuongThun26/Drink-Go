import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './AddressForm.css';

const addressSchema = z.object({
  street: z.string().min(3, 'Street is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
  country: z.string().min(2, 'Country is required'),
});

const AddressForm = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="address-form">
      <div className="form-group">
        <label htmlFor="street">Street Address</label>
        <input id="street" {...register('street')} />
        {errors.street && <p className="error">{errors.street.message}</p>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input id="city" {...register('city')} />
          {errors.city && <p className="error">{errors.city.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input id="state" {...register('state')} />
          {errors.state && <p className="error">{errors.state.message}</p>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code</label>
          <input id="zipCode" {...register('zipCode')} />
          {errors.zipCode && <p className="error">{errors.zipCode.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input id="country" {...register('country')} />
          {errors.country && <p className="error">{errors.country.message}</p>}
        </div>
      </div>
      <button type="submit" className="submit-btn">Save Address</button>
    </form>
  );
};

export default AddressForm;
