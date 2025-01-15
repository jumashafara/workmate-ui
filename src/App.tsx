import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import ModelMetrics from "./pages/Dashboard/ModelMetricsPage";
import FeatureImportance from "./pages/Dashboard/FeatureImportancePage";

import DefaultLayout from "./layout/DefaultLayout";
import IndividualPredictionPage from "./pages/Dashboard/IndividualPredictionPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Model Metrics Dashboard | RTV" />
              <ModelMetrics />
            </>
          }
        />
        <Route
          path="/feature-importance"
          element={
            <>
              <PageTitle title="Feature Importance | RTV" />
              <FeatureImportance />
            </>
          }
        />
        <Route
          path="/individual-predictions"
          element={
            <>
              <PageTitle title="Individual Predictions | RTV" />
              <IndividualPredictionPage />
            </>
          }
        />
        <Route
          path="/chat-bot"
          element={
            <>
              <PageTitle title="Chatbot | RTV" />
              <ChatPage />
            </>
          }
        />

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
      </Routes>
    </DefaultLayout>
  );
}

export default App;
