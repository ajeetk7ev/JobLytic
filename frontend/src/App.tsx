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
import FindJobsPage from "./pages/FindJobs";
import JobTrackerPage from "./pages/JobTracker";
import ResumeBuilderPage from "./pages/ResumeBuilder";
import SubscriptionPage from "./pages/Subscription";
import SettingsPage from "./pages/Settings";
import OnboardingPage from "./pages/Onboarding";

import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";

function App() {
  const { checkAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={'/dashboard'} />} />
      <Route
        path="/signup"
        element={
          <OpenRoute>
            <SignupPage />
          </OpenRoute>
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
      <Route path="/forgot-password" element={<OpenRoute><ForgotPassword /></OpenRoute>} />
      <Route path="/reset-password/:id" element={<OpenRoute><UpdatePassword /></OpenRoute>} />
      
      <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
      
      <Route element={<PrivateRoute><WorkSpace /></PrivateRoute>}>
        <Route path="/dashboard" index element={<DashboardPage />} />
        <Route path="/resume-upload" element={<ResumeUploadPage />} />
        <Route path="/resume-jd-matcher" element={<ResumeJDMatcherPage/>} />
        <Route path="/resume-jd-result" element={<JDMatchResultPage/>} />
        <Route path="/jobs" element={<FindJobsPage />} />
        <Route path="/job-tracker" element={<JobTrackerPage />} />
        <Route path="/resume-builder" element={<ResumeBuilderPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
