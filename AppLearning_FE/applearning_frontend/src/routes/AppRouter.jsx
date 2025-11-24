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
import ImageWordGame from "../pages/Game/ImageWordGame";
import MatchingGame from "../pages/Game/MatchingGame";
import PictureVocabularyGame from "../pages/Game/PictureVocabularyGame";
import LeaderBoards from "../pages/LeaderBoards/LeaderBoards";
import Learn from "../pages/Learn/Learn";
import GoogleLogin from "../pages/Login/GoogleLogin";
import Login from "../pages/Login/Login";
import Practice from "../pages/Practice/Practice";
import PracticeGame from "../pages/Practice/PracticeGame";
import PracticeLesson from "../pages/Practice/PracticeLesson";
import Profile from "../pages/Profile/Profile";
import Register from "../pages/Register/Register";
import Setting from "../pages/Setting/Setting";
import VocabularyLearn from "../pages/VocabularyLearn/VocabularyLearn";
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
    path: "/googlelogin",
    element: <GoogleLogin />,
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
    path: "/practice/unit/:unitId",
    element: <PracticeLesson />,
    layout: MainLayout,
    isProtected: true,
  },
  { path: "/practice/lesson/:lessonId/games", 
    element: <PracticeGame />, 
    layout: MainLayout, 
    isProtected: true 
  },
  { path: "/practice/game/matching/:lessonId", 
    element: <MatchingGame />, 
    layout: MainLayout, 
    isProtected: true 
  },
  { path: "/practice/game/picture-vocab/:lessonId", 
    element: <PictureVocabularyGame />, 
    layout: MainLayout, 
    isProtected: true 
  },
  { path: "/practice/game/image-word/:lessonId", 
    element: <ImageWordGame />, 
    layout: MainLayout, 
    isProtected: true 
  },
  { path: "/practice/game/arrange/:lessonId", 
    element: <ArrangeWordGame />, 
    layout: MainLayout, 
    isProtected: true 
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
  {
    path: "/vocabularylearn",
    element: <VocabularyLearn />,
    layout: MainLayout,
    isProtected: true,
  },
  {
    path: "/setting",
    element: <Setting />,
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