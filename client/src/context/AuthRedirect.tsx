import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@client/context/AuthContext';

export function AuthRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.primaryUserInfo?.suspension) {
      const suspension = user.primaryUserInfo.suspension;
      const isSuspended = new Date(suspension.endDate) > new Date();
      
      if (isSuspended && window.location.pathname !== '/banned') {
        navigate('/banned', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return null;
}