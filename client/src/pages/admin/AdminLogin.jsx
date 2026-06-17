import { Lock, LogIn } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getApiError } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLogin() {
  const { admin, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={admin?.role === "AGENT" ? "/agent/dashboard" : "/admin/dashboard"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const user = await login(form.email, form.password);
      toast.success("Welcome back.");
      navigate(user.role === "AGENT" ? "/agent/dashboard" : "/admin/dashboard");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-shiva-900 px-4 py-10">
      <form className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-saffron-500 text-shiva-900">
            <Lock size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-black text-shiva-900">Partner Login</h1>
          <p className="mt-1 text-sm text-slate-600">Manage GoTrippy bookings, cars, and pricing.</p>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              className="field"
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              className="field"
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </div>
        </div>
        <button className="btn-primary mt-6 w-full" type="submit" disabled={submitting}>
          <LogIn size={18} /> {submitting ? "Signing in..." : "Sign In"}
        </button>
        <Link className="btn-outline mt-3 w-full" to="/list-your-vehicle">
          New driver? Register and list vehicle
        </Link>
      </form>
    </main>
  );
}
