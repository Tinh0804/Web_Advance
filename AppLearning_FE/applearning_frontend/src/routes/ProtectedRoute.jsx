import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsValid(false);
      setIsChecking(false);
      return;
    }

    try {
      const res = await axiosInstance.get('/api/Auth/validate-jwt-token');
      // axios tự thêm Bearer token nếu bạn config interceptor

      if (res.data.isValid) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (requiredRole && user?.role !== requiredRole) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } else {
        throw new Error('Token invalid');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
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

  // if (!isValid) {
  //   return (
  //     <Navigate
  //       to={ROUTES.LOGIN}
  //       state={{ from: location.pathname }}
  //       replace
  //     />
  //   );
  // }

  return children;
}
