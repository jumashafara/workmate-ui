import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import ResetPassword from "./pages/Authentication/ResetPassword";
import ModelMetrics from "./pages/Dashboard/ModelMetricsPage";
import FeatureImportance from "./pages/Dashboard/FeatureImportancePage";
import StandardEvaluations from "./pages/Dashboard/StandardEvaluations";

import DefaultLayout from "./layout/DefaultLayout";
import IndividualPredictionPage from "./pages/Dashboard/IndividualPredictionPage";
import MultiplePredictionsPage from "./pages/Dashboard/MultiplePredictionsPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/Reports/HomePage";
import FloatingChat from "./components/FloatingChat";
import Settings from "./pages/Settings";

import Checkins from "./pages/Reports/Checkins";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const access_token = localStorage.getItem("access_token");

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
        <Route path="*" element={<Navigate to="/auth/signin" />} />
      </Routes>
    );
  }

  // Render other routes inside DefaultLayout
  return (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            access_token && isSuperuser ? (
              <>
                <PageTitle title="Standard Evaluations | RTV" />
                <StandardEvaluations />
              </>
            ) : (
              <Navigate to="/chat-bot" />
            )
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
      <FloatingChat />
    </DefaultLayout>
  );
}

export default App;
