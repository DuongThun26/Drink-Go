import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../store/userSlice.js';
import { selectUserProfile, selectUserLoading, selectUserError } from '../store/userSelectors.js';

export function useUserProfile() {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  const updateUserProfile = (profileData) => {
    dispatch(updateProfile(profileData));
  };

  return { profile, loading, error, updateUserProfile };
}
