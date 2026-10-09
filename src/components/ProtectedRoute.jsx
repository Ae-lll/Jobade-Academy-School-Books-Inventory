import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still checking whether someone is logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F8FD] flex items-center justify-center">
        <p className="text-sm text-[#64748B]">Loading...</p>
      </div>
    );
  }

  // Not logged in: send to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in: show the page
  return children;
}

export default ProtectedRoute;