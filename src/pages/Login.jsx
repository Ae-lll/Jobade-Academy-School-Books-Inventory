import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/jobade-logo.png";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, loading, signIn, error: authError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Still checking for an existing session: show nothing for a moment
  if (loading) return null;

  // Already logged in: go straight to the dashboard
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setError("");
    setSubmitting(true);

    const { error: signInError } = await signIn(email.trim(), password);

    setSubmitting(false);

    if (signInError) {
      setError("Incorrect email or password. Please try again.");
      return;
    }

    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Jobade Academy logo"
            className="h-20 w-20 object-contain"
          />
          <h1 className="mt-3 text-xl font-semibold text-[#102A43]">Jobade Academy</h1>
          <p className="text-sm text-[#64748B]">School Book Inventory</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4"
        >
          <div>
            <h2 className="text-lg font-semibold text-[#102A43]"> Sign in</h2>
            <p className="text-sm text-[#64748B] mt-1">
              Enter your account details to continue.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          {authError && (
            <div role="alert" className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
              {authError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#102A43] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] text-sm text-[#102A43] border border-transparent focus:border-[#1479F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#102A43] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] text-sm text-[#102A43] border border-transparent focus:border-[#1479F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#1479F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F66CC] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;