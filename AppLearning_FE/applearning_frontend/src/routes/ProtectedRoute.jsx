import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";

export default function ProtectedRoute({ children, requiredRole }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setValid(false);
      setChecking(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Auth/validate-jwt-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const role = user?.role;

        const ok = res.ok && data.status && data.data?.isValid;

        if (!ok) {
          localStorage.clear();
          setValid(false);
        } else {
          if (requiredRole) setValid(role === requiredRole);
          else setValid(true);
        }
      } catch (e) {
        console.error(e);
        localStorage.clear();
        setValid(false);
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, [requiredRole]);

  if (checking)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Đang xác thực...
      </div>
    );

  if (!valid) return <Navigate to="/login" replace />;

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};
