import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Login } from "../api/authApi";
import ThemeToggle from "./ThemeToggle";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("tasktracker-theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("tasktracker-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await Login(formData);
      if (res && res.message === "Login success.") {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-[#1a1825] dark:bg-[#141220] dark:text-[#e8e6f0] flex flex-col justify-center items-center px-6 relative transition-colors duration-300">
      <div className="absolute right-6 top-6">
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-[#1e1c2e] border border-[rgba(26,24,37,0.1)] dark:border-[rgba(232,230,240,0.1)] rounded-2xl p-8 shadow-xl transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-[#3d35c8] dark:text-[#6b63e8] text-xl font-extrabold tracking-[0.2em] uppercase font-mono mb-2">
            TASKS SIGN IN
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8c89a8] font-mono">
            Welcome back. Please enter your credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg text-xs font-semibold font-mono bg-red-500/10 border border-red-500/20 text-red-500 animate-fade-in flex items-center gap-2">
              <span className="shrink-0">✕</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8c89a8] mb-2 font-mono">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. name@example.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#eae9e3] dark:bg-[#252240] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-[#8c89a8]/50 border-0 focus:ring-2 focus:ring-[#3d35c8] dark:focus:ring-[#6b63e8] transition-all text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8c89a8] mb-2 font-mono">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#eae9e3] dark:bg-[#252240] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-[#8c89a8]/50 border-0 focus:ring-2 focus:ring-[#3d35c8] dark:focus:ring-[#6b63e8] transition-all text-sm font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#3d35c8] dark:bg-[#6b63e8] text-white hover:opacity-95 rounded-xl text-xs font-bold tracking-wider font-mono uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                SIGNING IN...
              </>
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#252240] text-center">
          <p className="text-xs text-slate-500 dark:text-[#8c89a8] font-mono">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#3d35c8] dark:text-[#6b63e8] hover:underline font-bold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
