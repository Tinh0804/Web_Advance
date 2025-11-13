// src/routes/AppRouter.jsx
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Layouts
import AuthLayout from "../components/layout/AuthLayout";
import MainLayout from "../components/layout/MainLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";

// Pages
import First from "../pages/First/First";
import Friend from "../pages/Friend/Friend";
import LeaderBoards from "../pages/LeaderBoards/LeaderBoards";
import Learn from "../pages/Learn/Learn";
import Login from "../pages/Login/Login";
import Practice from "../pages/Practice/Practice";
import Profile from "../pages/Profile/Profile";
import Register from "../pages/Register/Register";
// import Admin from "../pages/Admin/Admin";
// import NotFound from "../pages/NotFound/NotFound";

// Routes configuration
const routesConfig = [
  //PUBLIC ROUTES (Không cần login)
  {
    path: "/first",
    element: <First />,
    layout: AuthLayout,
    isProtected: false,
  },
  {
    path: "/login",
    element: <Login />,
    layout: AuthLayout,
    isProtected: false,
  },
  {
    path: "/register",
    element: <Register />,
    layout: AuthLayout,
    isProtected: false,
  },
  
  //PROTECTED ROUTES (Cần login)
  {
    path: "/learn",
    element: <Learn />,
    layout: MainLayout,
    isProtected: true,
  },

  {
    path: "/practice",
    element: <Practice />,
    layout: MainLayout,
    isProtected: true,
  },
  {
    path: "/leaderboards",
    element: <LeaderBoards />,
    layout: MainLayout,
    isProtected: true,
  },
  {
    path: "/friend",
    element: <Friend />,
    layout: MainLayout,
    isProtected: true,
  },
  {
    path: "/profile",
    element: <Profile />,
    layout: MainLayout,
    isProtected: true,
  },
  
  // ========== ADMIN ROUTES (Cần role Admin) ==========
  // {
  //   path: "/admin",
  //   element: <Admin />,
  //   layout: MainLayout,
  //   isProtected: true,
  //   requiredRole: "Admin",
  // },
];

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Render routes từ config */}
        {routesConfig.map(({ path, element, layout: Layout, isProtected }) => (
          <Route
            key={path}
            path={path}
            element={
              <Layout>
                {isProtected ? (
                  <ProtectedRoute>{element}</ProtectedRoute>
                ) : (
                  element
                )}
              </Layout>
            }
          />
        ))}

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/first" replace />} />
        
        {/* 404 Not Found - Optional */}
        {/* <Route path="*" element={<AuthLayout><NotFound /></AuthLayout>} /> */}
      </Routes>
    </Router>
  );
}