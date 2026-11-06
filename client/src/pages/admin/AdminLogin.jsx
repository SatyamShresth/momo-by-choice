import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import MomoIcon from "../../components/ui/MomoIcon.jsx";

export default function AdminLogin() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Email aur password dono likhein.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Login ho gaya");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const field = "w-full rounded-xl border-2 border-cocoa-900 bg-white px-4 py-2.5 text-sm outline-none focus:border-chili";

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-dark p-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm space-y-4 rounded-2xl border-2 border-cocoa-900 bg-white p-6 shadow-pop">
        <div className="text-center">
          <MomoIcon className="mx-auto h-14 w-14 text-chili" />
          <h1 className="mt-2 text-2xl">Admin Login</h1>
        </div>

        <div>
          <label htmlFor="ad-email" className="mb-1 block text-sm font-bold">Email</label>
          <input id="ad-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="ad-pass" className="mb-1 block text-sm font-bold">Password</label>
          <input id="ad-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
        </div>

        {error && <p className="text-sm font-bold text-chili" role="alert">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full disabled:opacity-60">
          {submitting ? "Login ho raha hai..." : "Login"}
        </Button>
      </form>
    </main>
  );
}