import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { GameProvider } from '../context/GameContext';
import { UserProvider } from '../context/UserContext';
// Layouts
import AppLayout from "../components/layout/Admin/AppLayout";
import AuthLayout from "../components/layout/User/AuthLayout";
import MainLayout from "../components/layout/User/MainLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";


// Pages User
import First from "../pages/User/First/First";
import Friend from "../pages/User/Friend/Friend";
import ArrangeWordGame from "../pages/User/Game/ArrangeWordGame";
import ListenChooseGame from "../pages/User/Game/ListenChooseGame";
import MatchingGame from "../pages/User/Game/MatchingGame";
import PictureVocabularyGame from "../pages/User/Game/PictureVocabularyGame";
import LeaderBoards from "../pages/User/LeaderBoards/LeaderBoards";
import Learn from "../pages/User/Learn/Learn";
import GoogleLogin from "../pages/User/Login/GoogleLogin";
import Login from "../pages/User/Login/Login";
import Practice from "../pages/User/Practice/Practice";
import PracticeGame from "../pages/User/Practice/PracticeGame";
import Profile from "../pages/User/Profile/Profile";
import LanguageSelector from "../pages/User/Register/LanguageSelector";
import LevelSelector from "../pages/User/Register/LevelSelector";
import Register from "../pages/User/Register/Register";
import Setting from "../pages/User/Setting/Setting";
import VocabularyLearn from "../pages/User/VocabularyLearn/VocabularyLearn";

// Pages Admin 
import AdminBlank from "../pages/Admin/Blank";
import AdminCalendar from "../pages/Admin/Calendar";
import AdminAnalytics from "../pages/Admin/Dashboard/Analytics";
import CourseManagement from "../pages/Admin/Dashboard/CourseManagement";
import AdminHome from "../pages/Admin/Dashboard/Home";
import LessonManagement from "../pages/Admin/Dashboard/LessonManagement";
import AdminSettings from "../pages/Admin/Dashboard/Settings";
import UserManagement from "../pages/Admin/Dashboard/UserManagement";
import FormElements from "../pages/Admin/Forms/FormElements";
import BasicTables from "../pages/Admin/Tables/BasicTables";
import AdminUserProfiles from "../pages/Admin/UserProfiles";

const adminRoutesConfig = [
  { index: true, element: <AdminHome /> },
  { path: "analytics", element: <AdminAnalytics /> },
  { path: "course-management", element: <CourseManagement /> },
  { path: "lesson-management", element: <LessonManagement /> },
  { path: "user-management", element: <UserManagement /> },
  { path: "settings", element: <AdminSettings /> },
  { path: "profile", element: <AdminUserProfiles /> },
  { path: "calendar", element: <AdminCalendar /> },
  { path: "blank", element: <AdminBlank /> },
  { path: "form-elements", element: <FormElements/>},
  { path: "basic-tables", element: <BasicTables/> }
];

const userRoutesConfig = [
  { path: "/first", element: <First />, layout: AuthLayout, isProtected: false },
  { path: "/login", element: <Login />, layout: AuthLayout, isProtected: false },
  { path: "/googlelogin", element: <GoogleLogin />, layout: AuthLayout, isProtected: false },
  { path: "/register", element: <Register />, layout: AuthLayout, isProtected: false },
  { path: "/register/select-language", element: <LanguageSelector />, layout: AuthLayout, isProtected: false },
  { path: "/register/select-level", element: <LevelSelector />, layout: AuthLayout, isProtected: false },

  { path: "/learn", element: <Learn />, layout: MainLayout, isProtected: true },
  { path: "/practice/game/listen-choose/:unitId", element: <ListenChooseGame />, layout: MainLayout, isProtected: true },
  { path: "/vocabulary/:lessonId", element: <VocabularyLearn />, layout: MainLayout, isProtected: true },
  { path: "/practice", element: <Practice />, layout: MainLayout, isProtected: true },
  { path: "/practice/unit/:unitId", element: <PracticeGame />, layout: MainLayout, isProtected: true },
  { path: "/practice/game/matching/:unitId", element: <MatchingGame />, layout: MainLayout, isProtected: true },
  { path: "/practice/game/picture-vocab/:unitId", element: <PictureVocabularyGame />, layout: MainLayout, isProtected: true },
  { path: "/practice/game/arrange/:unitId", element: <ArrangeWordGame />, layout: MainLayout, isProtected: true },
  { path: "/leaderboards", element: <LeaderBoards />, layout: MainLayout, isProtected: true },
  { path: "/friend", element: <Friend />, layout: MainLayout, isProtected: true },
  { path: "/profile", element: <Profile />, layout: MainLayout, isProtected: true },
  { path: "/setting", element: <Setting />, layout: MainLayout, isProtected: true },
];

export default function AppRouter() {
  return (
    <Router>
      <UserProvider>
        <GameProvider>
          <Routes>

            {userRoutesConfig.map(({ path, element, layout: Layout, isProtected }) => (
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

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {adminRoutesConfig.map((route) => (
                <Route
                  key={route.path || "index"}
                  path={route.path}
                  index={route.index}
                  element={route.element}
                />
              ))}
            </Route>

            <Route path="/" element={<Navigate to="/first" replace />} />

          </Routes>
        </GameProvider>
      </UserProvider>
    </Router>
  );
}
