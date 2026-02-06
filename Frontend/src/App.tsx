import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ResearchDetailPage from "./pages/ResearchDetailPage";
import CreateResearchPage from "./pages/CreateResearchPage";
import ManagePortfolioPage from "./pages/ManagePortfolioPage";
import EditResearchPage from "./pages/EditResearchPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/research/:id" element={<ResearchDetailPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateResearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <ManagePortfolioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={
          <ProtectedRoute>
            <EditResearchPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
