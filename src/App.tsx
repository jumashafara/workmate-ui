import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import GoogleCallback from "./pages/Authentication/GoogleCallback";
import ModelMetrics from "./pages/Dashboard/ModelMetricsPage";
import FeatureImportance from "./pages/Dashboard/FeatureImportancePage";
import SuperUserPredictionsDashbord from "./pages/Dashboard/Superuser/SuperUserPredictionsDashbord";
import SuperUserClusterTrends from "./pages/Dashboard/Superuser/SuperUserClusterTrends";

import DefaultLayout from "./layout/DefaultLayout";
import IndividualPredictionPage from "./pages/Dashboard/IndividualPredictionPage";
import MultiplePredictionsPage from "./pages/Dashboard/MultiplePredictionsPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/Reports/StandardEvaluations";
import FloatingChat from "./components/FloatingChat";
import Settings from "./pages/Settings";

import Checkins from "./pages/Reports/Checkins";
import { Map } from "./pages/TestPage";
import AreaManagerPredictionsDashbord from "./pages/Dashboard/AreaManager/AreaManagerPredictionsDashbord";
import ProjectManagerPredictionsDashbord from "./pages/Dashboard/ProjectManagerPredictionsDashbord";
import ProjectOfficerPredictionsDashbord from "./pages/Dashboard/ProjectOfficerPredictionsDashbord";
import TeamLeadPredictionsDashbord from "./pages/Dashboard/TeamLeadPredictionsDashbord";
import AreaManagerClusterTrends from "./pages/Dashboard/AreaManager/AreaManagerClusterTrends";


// Add this special handler component for Google OAuth callback
function GoogleCallbackHandler() {
  useEffect(() => {
    // Extract the code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Redirect to the hash-based callback route with the code
      window.location.href = `/#/auth/google/callback?code=${code}`;
    } else {
      // If there's no code, redirect to sign in
      window.location.href = '/#/auth/signin';
    }
  }, []);
  
  // Show loading while redirecting
  return <div>Redirecting...</div>;
}

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const access_token = localStorage.getItem("access_token");
  const region = localStorage.getItem("region");
  const district = localStorage.getItem("district");

  const userRole = localStorage.getItem('role');
  console.log('User Role: ', userRole)  
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Special routes that should be rendered outside the DefaultLayout
  const isAuthRoute = pathname.includes('/auth/');
  const isResetPasswordRoute = pathname.includes('/auth/reset-password/');
  const isSuperuser = localStorage.getItem("superuser") === "true";
  const isAreaManager = localStorage.getItem("role") === "area_manager";
  const isProjectManager = localStorage.getItem("role") === "project_manager";
  const isProjectOfficer = localStorage.getItem("role") === "project_officer";
  const isTeamLead = localStorage.getItem("role") === "team_lead";

  if (loading) {
    return <Loader />;
  }

  // Render auth routes and reset password route outside DefaultLayout
  if (isResetPasswordRoute) {
    return (
      <Routes>
        <Route
          path="auth/reset-password/:uid/:token"
          element={
            <>
              <PageTitle title="Reset Password | RTV" />
              <ResetPassword />
            </>
          }
        />
      </Routes>
    );
  }

  if (isAuthRoute) {
    return (
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | RTV" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | RTV" />
              <SignUp />
            </>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <>
              <PageTitle title="Forgot Password | RTV" />
              <ForgotPassword />
            </>
          }
        />
        <Route
          path="/auth/google/callback"
          element={
            <>
              <PageTitle title="Google Authentication | RTV" />
              <GoogleCallback />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/auth/signin" />} />
      </Routes>
    );
  }

  // Special routes outside DefaultLayout and outside hash routing
  // This is needed for OAuth callback to work with hash routing
  if (window.location.pathname === '/auth/google/callback') {
    return <GoogleCallbackHandler />;
  }

  // Render other routes inside DefaultLayout
  return (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
    (() => {
      if (access_token) {
        if (isSuperuser) {
          return (
            <>
              <PageTitle title="Super User Predictions | RTV" />
              <SuperUserPredictionsDashbord />
            </>
          );
        } else if (isAreaManager) {
          return (
            <>
              <PageTitle title="Area Manager Predictions | RTV" />
              <AreaManagerPredictionsDashbord />
            </>
          );
        } else if (isProjectManager) {
          return (
            <>
              <PageTitle title="Project Manager Predictions | RTV" />
              <ProjectManagerPredictionsDashbord />
            </>
          );
        } else if (isProjectOfficer) {
          return (
            <>
              <PageTitle title="Project Officer Predictions | RTV" />
              <ProjectOfficerPredictionsDashbord />
            </>
          );
        } else if (isTeamLead) {
          return (
            <>
              <PageTitle title="Team Lead Predictions | RTV" />
              <TeamLeadPredictionsDashbord />
            </>
          );
        } else {
          return (
              <>
                <PageTitle title="Standard Evaluations | RTV" />
              <Navigate to="/chat-bot" />
            </>
          );
        }
      }
      return <Navigate to="/chat-bot" />;
    })()
          }
        />

        <Route
          path="/model-metrics"
          element={
            access_token && isSuperuser ? (
              <>
                <PageTitle title="Multiple Predictions | RTV" />
                <ModelMetrics />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/feature-importance"
          element={
            access_token && isSuperuser ? (
              <>
                <PageTitle title="Feature Importance | RTV" />
                <FeatureImportance />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/individual-predictions"
          element={
            access_token && isSuperuser ? (
              <>
                <PageTitle title="Individual Predictions | RTV" />
                <IndividualPredictionPage />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/multiple-predictions"
          element={
           access_token && isSuperuser ? (
              <>
                <PageTitle title="Multiple Predictions | RTV" />
                <MultiplePredictionsPage />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/cluster-income-analysis"
          element={
            access_token ? (
              isSuperuser ? (
                <>
                  <PageTitle title="Trends by Evaluation Month | RTV" />
                  <SuperUserClusterTrends />
                </>
              ) : isAreaManager ? (
              <>
                <PageTitle title="Trends by Evaluation Month | RTV" />
                  <AreaManagerClusterTrends />
              </>
              ) : (
                <Navigate to="/auth/signin" />
              )
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/standard-evaluations"
          element={
            access_token && isSuperuser ? (
              <>
                <PageTitle title="Model Metrics Dashboard | RTV" />
                <HomePage />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/chat-bot"
          element={
            access_token ? (
              <>
                <PageTitle title="Chatbot | RTV" />
                <ChatPage />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        <Route
          path="/test-page"
          element={
            access_token ? (
              <>
                <Map />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />
        {access_token && isSuperuser && <Route
          path="/settings"
          element={
            access_token ? (
              <>
                <PageTitle title="Multiple Predictions | RTV" />
                <Settings />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />}
        {access_token && isSuperuser && <Route
          path="/checkin-evaluations"
          element={
            access_token && isSuperuser ? (
              <>
                <PageTitle title="Check-ins | RTV" />
                <Checkins />
              </>
            ) : (
              <Navigate to="/auth/signin" />
            )
          }
        />}
      </Routes>
      {/* Only show FloatingChat when not on the chat-bot page */}
      {pathname !== '/chat-bot' && <FloatingChat />}
    </DefaultLayout>
  );
}

export default App;
