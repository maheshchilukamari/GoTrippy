import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
  const { checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return <LoadingSpinner label="Checking partner session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/driver/login" replace />;
  }

  return children;
}
