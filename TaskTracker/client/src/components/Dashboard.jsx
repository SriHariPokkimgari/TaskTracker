import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Toast from "./Toast";
import ThemeToggle from "./ThemeToggle";

import { updateTask, deleteTask, getTasks, createTask } from "../api/taskApi";
import { Logout, getMe } from "../api/authApi";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  const [viewMode, setViewMode] = useState("list");
  const [tagFilter, setTagFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("tasktracker-theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("tasktracker-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const existTasks = useCallback(async () => {
    try {
      const existingTasks = await getTasks();
      setTasks(existingTasks);
    } catch (err) {
      if (
        (err.message && err.message.includes("401")) ||
        err.message === "Access denied." ||
        err.message === "Token expired."
      ) {
        navigate("/login");
      } else {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast, navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      console.error("Fetch user error:", err);
    }
  }, []);

  useEffect(() => {
    existTasks();
    fetchUser();
  }, [existTasks, fetchUser]);

  const handleLogout = async () => {
    try {
      await Logout();
      navigate("/login");
    } catch {
      showToast("Failed to log out", "error");
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t)),
        );
        showToast("Task updated successfully!");
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [created, ...prev]);
        showToast("Task created successfully!");
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast("Task deleted successfully!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateTask(id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const stats = {
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const handleStatCardClick = (statusType) => {
    if (statusFilter === statusType) {
      setStatusFilter("All");
    } else {
      setStatusFilter(statusType);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesTag = tagFilter === "All" || t.tag === tagFilter;
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesTag && matchesStatus;
  });

  const tagsList = [
    "All",
    "Work",
    "Assignment",
    "Personal development",
    "Study",
    "Game",
    "Entertainment",
  ];

  return (
    <div className="min-h-screen bg-bg-light text-fg-light dark:bg-[#141220] dark:text-fg-dark transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="sticky top-0 z-40 bg-bg-light/80 dark:bg-[#141220]/80 backdrop-blur-md border-b border-border-light dark:border-border-dark py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[#3d35c8] dark:text-primary-dark text-base font-extrabold tracking-[0.2em] uppercase font-mono">
              TASKS
            </h1>
            {user && (
              <>
                <span className="text-slate-400 dark:text-muted-fg-dark font-mono">
                  ·
                </span>
                <span className="text-xs text-slate-500 dark:text-secondary-foreground-dark font-mono font-bold flex items-center gap-1">
                  👤 {user.username}
                </span>
              </>
            )}
            <span className="text-slate-400 dark:text-muted-fg-dark font-mono">
              ·
            </span>
            <span className="text-xs text-slate-500 dark:text-muted-fg-dark font-mono font-medium">
              {tasks.length} items · {stats.completed} resolved
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-200/60 dark:bg-[#252240] p-1 rounded-lg border border-slate-300 dark:border-transparent">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-card-dark text-[#3d35c8] dark:text-primary-dark shadow" : "text-slate-500 dark:text-muted-fg-dark"}`}
                title="List View"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("board")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === "board" ? "bg-white dark:bg-card-dark text-[#3d35c8] dark:text-primary-dark shadow" : "text-slate-500 dark:text-muted-fg-dark"}`}
                title="Board View"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                </svg>
              </button>
            </div>

            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#252240] dark:hover:bg-[#2d2a45] text-slate-600 dark:text-[#a09de0] hover:text-red-500 dark:hover:text-red-400 border border-slate-200 dark:border-[#2d2a45] rounded-lg text-xs font-bold tracking-wider font-mono uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Logout"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              LOGOUT
            </button>

            <button
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-[#3d35c8] dark:bg-primary-dark text-white hover:opacity-95 rounded-lg text-xs font-bold tracking-wider font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/10"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              NEW
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              id: "pending",
              label: "TO DO",
              count: stats.pending,
              iconClass: "border-slate-300 dark:border-[#3d3a55]",
              icon: "todo",
            },
            {
              id: "in-progress",
              label: "IN PROGRESS",
              count: stats.inProgress,
              iconClass:
                "border-[#3d35c8] dark:border-[#6b63e8] text-[#3d35c8] dark:text-[#6b63e8]",
              icon: "clock",
            },
            {
              id: "completed",
              label: "DONE",
              count: stats.completed,
              iconClass: "bg-[#3d35c8] dark:bg-[#6b63e8]",
              icon: "check",
            },
          ].map((card) => {
            const isActive = statusFilter === card.id;
            return (
              <button
                key={card.id}
                onClick={() => handleStatCardClick(card.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer select-none
                  ${
                    isActive
                      ? "bg-secondary-light dark:bg-[#252240] border-[#3d35c8] dark:border-primary-dark"
                      : "bg-white dark:bg-card-dark dark:border-border-dark hover:border-slate-300 dark:hover:border-[#252240]"
                  }`}
              >
                <div className="shrink-0">
                  {card.icon === "check" ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-[#3d35c8] dark:bg-primary-dark flex items-center justify-center text-white">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : card.icon === "clock" ? (
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-[#3d35c8] dark:border-primary-dark flex items-center justify-center text-[#3d35c8] dark:text-primary-dark">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 8v4l3 3"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 dark:border-muted-fg-dark" />
                  )}
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-800 dark:text-white leading-none">
                    {card.count}
                  </div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-muted-fg-dark font-mono mt-1">
                    {card.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-muted-fg-dark font-mono mr-1">
            TAG:
          </span>
          {tagsList.map((tag) => {
            const isSelected = tagFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold font-sans tracking-wide transition-all cursor-pointer border
                  ${
                    isSelected
                      ? "bg-[#3d35c8] dark:bg-primary-dark text-white border-transparent"
                      : "bg-white dark:bg-card-dark text-slate-600 dark:text-muted-fg-dark border-border-light dark:border-[#252240] hover:bg-slate-100 dark:hover:bg-[#252240]"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <main className="mb-12">
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTaskClick}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            viewMode={viewMode}
            isLoading={isLoading}
          />
        </main>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleSaveTask}
          editingTask={editingTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
