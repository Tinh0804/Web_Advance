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

import ArrangeWordGame from "../pages/Game/ArrangeWordGame";
import ListenChooseGame from "../pages/Game/ListenChooseGame";
import MatchingGame from "../pages/Game/MatchingGame";
import PictureVocabularyGame from "../pages/Game/PictureVocabularyGame";
import LeaderBoards from "../pages/LeaderBoards/LeaderBoards";
import Learn from "../pages/Learn/Learn";
import GoogleLogin from "../pages/Login/GoogleLogin";
import Login from "../pages/Login/Login";
import Practice from "../pages/Practice/Practice";
import PracticeGame from "../pages/Practice/PracticeGame";
import Profile from "../pages/Profile/Profile";
import Register from "../pages/Register/Register";
import Setting from "../pages/Setting/Setting";
import VocabularyLearn from "../pages/VocabularyLearn/VocabularyLearn";

const routesConfig = [
  { 
    path: "/first", 
    element: <First />, 
    layout: AuthLayout, 
    isProtected: false 
  },
  { 
    path: "/login", 
    element: <Login />, 
    layout: AuthLayout, 
    isProtected: false 
  },
  { 
    path: "/googlelogin", 
    element: <GoogleLogin />, 
    layout: AuthLayout, 
    isProtected: false 
  },
  { 
    path: "/register", 
    element: <Register />, 
    layout: AuthLayout, 
    isProtected: false 
  },

  // ========== PROTECTED ROUTES ==========
  { 
    path: "/learn", 
    element: <Learn />, 
    layout: MainLayout, 
    isProtected: true 
  },
  { 
    path: "/practice/game/listen-choose/:unitId", 
    element: <ListenChooseGame />, 
    layout: MainLayout, 
    isProtected: true 
  },

  // Route cho VocabularyLearn với lessonId parameter
  { 
    path: "/vocabulary/:lessonId", 
    element: <VocabularyLearn />, 
    layout: MainLayout, 
    isProtected: true 
  },
  
  // Trang chính của Practice: chọn Unit
  { 
    path: "/practice", 
    element: <Practice />, 
    layout: MainLayout, 
    isProtected: true 
  },

  // Trang chọn loại game (Matching, Arrange, v.v.) - Dùng :unitId
  { 
    path: "/practice/unit/:unitId", 
    element: <PracticeGame />, 
    layout: MainLayout, 
    isProtected: true 
  },

  // Các game thực tế - Dùng :unitId (không phải :lessonId)
  { 
    path: "/practice/game/matching/:unitId",        
    element: <MatchingGame />,         
    layout: MainLayout, 
    isProtected: true 
  },
  { 
    path: "/practice/game/picture-vocab/:unitId",   
    element: <PictureVocabularyGame />,
    layout: MainLayout, 
    isProtected: true 
  },
  { 
    path: "/practice/game/arrange/:unitId",         
    element: <ArrangeWordGame />,      
    layout: MainLayout, 
    isProtected: true 
  },

  // Các trang còn lại
  { 
    path: "/leaderboards", 
    element: <LeaderBoards />, 
    layout: MainLayout, 
    isProtected: true 
  },
  { 
    path: "/friend",       
    element: <Friend />,       
    layout: MainLayout, 
    isProtected: true 
  },
  { 
    path: "/profile",      
    element: <Profile />,      
    layout: MainLayout, 
    isProtected: true 
  },
  { 
    path: "/setting",      
    element: <Setting />,      
    layout: MainLayout, 
    isProtected: true 
  },
];

export default function AppRouter() {
  return (
    <Router>
      <Routes>
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

        {/* Redirect mặc định */}
        <Route path="/" element={<Navigate to="/first" replace />} />

        {/* Optional: 404 */}
        {/* <Route path="*" element={<AuthLayout><NotFound /></AuthLayout>} /> */}
      </Routes>
    </Router>
  );
}