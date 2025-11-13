import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
        // Gọi API xác thực token
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Auth/validate-jwt-token`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const user = JSON.parse(localStorage.getItem('user'));
          if (requiredRole && user?.role !== requiredRole) 
            setIsValid(false);
          else 
            setIsValid(true);
        } else {
          // Token hết hạn hoặc không hợp lệ
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setIsValid(false);
        }
      } catch (error) {
        console.error('Verify token error:', error);
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
