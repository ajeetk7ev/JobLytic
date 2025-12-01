import { Routes, Route, Navigate } from "react-router-dom";
import { SignupPage } from "./pages/Signup";
import { LoginPage } from "./pages/Login";
import ForgotPassword from "./pages/Forgot-password";
import UpdatePassword from "./pages/Update-password";
import ResumeUploadPage from "./pages/ResumeUpload";
import WorkSpace from "./pages/Workspace";
import OpenRoute from "./components/auth/OpenRoute";
import PrivateRoute from "./components/auth/PrivateRoute";
import DashboardPage from "./pages/Dashboard";
import ResumeJDMatcherPage from "./pages/ResumeJDMatcher";
import JDMatchResultPage from "./pages/ResumeJDResult";

function App() {
  return (
  
    <Routes>
      <Route path="/" element={<Navigate to={'/dashboard'} />} />
      <Route
        path="/signup"
        element={
          <PrivateRoute>
            <SignupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/login"
        element={
          <OpenRoute>
            <LoginPage />
          </OpenRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id" element={<UpdatePassword />} />
      <Route path="/resume-upload" element={<ResumeUploadPage />} />
      <Route element={<WorkSpace />}>
        <Route path="/dashboard" index element={<DashboardPage />} />
        <Route path="resume-jd-matcher" element={<ResumeJDMatcherPage/>} />
         <Route path="resume-jd-result" element={<JDMatchResultPage/>} />
      </Route>
    </Routes>
  );
}

export default App;
