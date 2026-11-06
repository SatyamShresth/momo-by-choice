import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import MomoIcon from "../ui/MomoIcon.jsx";

export default function RequireAdmin({ children }) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <MomoIcon steam className="h-16 w-16 animate-pulse text-chili" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="font-display text-2xl font-extrabold">Aapke paas access nahi hai</p>
        <button type="button" onClick={logout} className="font-bold text-chili underline">Logout</button>
      </div>
    );
  }
  return children;
}