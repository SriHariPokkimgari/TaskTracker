import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { getMe } from "../api/authApi";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Theme Sync
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("tasktracker-theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("tasktracker-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getMe();
        if (user) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-[#1a1825] dark:bg-[#141220] dark:text-[#e8e6f0] transition-colors duration-300 relative overflow-hidden flex flex-col justify-between">
      {/* Decorative Blur Backgrounds */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 -left-40 w-[450px] h-[450px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#3d35c8] dark:text-[#6b63e8] text-base font-extrabold tracking-[0.2em] uppercase font-mono">
            TASKS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          {!loading && (
            <>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-[#3d35c8] dark:bg-[#6b63e8] text-white hover:opacity-95 rounded-lg text-xs font-bold font-mono tracking-wide uppercase transition-all shadow-lg shadow-indigo-500/10"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-xs font-bold font-mono tracking-wide uppercase text-slate-600 dark:text-[#8c89a8] hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-[#3d35c8] dark:bg-[#6b63e8] text-white hover:opacity-95 rounded-lg text-xs font-bold font-mono tracking-wide uppercase transition-all shadow-lg shadow-indigo-500/10"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eae9f5] dark:bg-[#252240] text-[#3d35c8] dark:text-[#a09de0] text-xs font-bold font-mono uppercase mb-6 animate-fade-in">
          🚀 Next-gen task manager
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-3xl">
          Organize your projects,{" "}
          <span className="text-[#3d35c8] dark:text-[#6b63e8] bg-clip-text">
            one task at a time.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-500 dark:text-[#8c89a8] max-w-2xl mb-10 font-sans font-light leading-relaxed">
          A gorgeous dashboard equipped with real-time views, priority sorting,
          status cards, and seamless Board vs. List layouts designed to elevate
          your work structure.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            to={isAuthenticated ? "/dashboard" : "/signup"}
            className="px-7 py-3.5 bg-[#3d35c8] dark:bg-[#6b63e8] text-white hover:opacity-95 rounded-xl text-xs font-bold font-mono tracking-widest uppercase transition-all shadow-xl shadow-indigo-500/20"
          >
            {isAuthenticated ? "Go to Dashboard" : "Start For Free"}
          </Link>
          <a
            href="#features"
            className="px-7 py-3.5 bg-white dark:bg-[#1e1c2e] text-slate-600 dark:text-[#8c89a8] border border-[rgba(26,24,37,0.1)] dark:border-[#252240] hover:bg-slate-50 dark:hover:bg-[#252240] rounded-xl text-xs font-bold font-mono tracking-widest uppercase transition-all shadow-sm"
          >
            Learn More
          </a>
        </div>

        {/* Feature Cards Grid */}
        <section
          id="features"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8"
        >
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#1e1c2e] border border-[rgba(26,24,37,0.1)] dark:border-[rgba(232,230,240,0.1)] rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-[#3d35c8] dark:text-[#a09de0] flex items-center justify-center font-mono font-bold text-sm mb-4">
              ⌨
            </div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-white mb-2">
              Flex layouts
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8c89a8] font-sans leading-relaxed">
              Toggle between a highly interactive Scrum board or a vertical task
              stack list depending on your focus.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#1e1c2e] border border-[rgba(26,24,37,0.1)] dark:border-[rgba(232,230,240,0.1)] rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-[#3d35c8] dark:text-[#a09de0] flex items-center justify-center font-mono font-bold text-sm mb-4">
              ⏳
            </div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-white mb-2">
              Overdue Alerts
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8c89a8] font-sans leading-relaxed">
              Clean visual flags and warnings let you know instantly if a
              priority task is behind schedule.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#1e1c2e] border border-[rgba(26,24,37,0.1)] dark:border-[rgba(232,230,240,0.1)] rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-[#3d35c8] dark:text-[#a09de0] flex items-center justify-center font-mono font-bold text-sm mb-4">
              🎨
            </div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-800 dark:text-white mb-2">
              Adaptive Dark Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8c89a8] font-sans leading-relaxed">
              Transition smoothly between warm off-white and deep space-slate
              environments for eye comfort.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-[rgba(26,24,37,0.1)] dark:border-[#252240] text-center w-full max-w-6xl mx-auto px-6">
        <p className="text-[10px] tracking-wider font-mono text-slate-400 dark:text-slate-600 uppercase">
          © {new Date().getFullYear()} Tasks Inc. Built with MERN, Tailwind CSS
          & Google Fonts.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
