import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { API_BASE_URL, ROUTES } from '../utils/constants';

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/Auth/validate-jwt-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token })
        });

        const data = await res.json();
        if (res.ok && data.status === true && data.data?.isValid === true) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          // console.log('User:', user);
          if (requiredRole && user?.role !== requiredRole) 
            setIsValid(false);
          else 
            setIsValid(true); 
        } else {
          console.log('Token không hợp lệ:', data.message || data);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setIsValid(false);
        }
      } catch (error) {
        console.error('Verify token error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken();
  }, [requiredRole]);

  if (isChecking)
    return <div className="text-center mt-10">Đang kiểm tra đăng nhập...</div>;

  if (!isValid) 
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;

  return children;
}