import { useState, useEffect } from "react";

export default function TaskForm({ onSubmit, editingTask, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MED",
    status: "pending",
    dueDate: "",
    tag: "Work",
  });

  const tags = [
    "Work",
    "Assignment",
    "Personal development",
    "Study",
    "Game",
    "Entertainment",
  ];

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "MED",
        status: editingTask.status || "pending",
        dueDate: editingTask.dueDate
          ? editingTask.dueDate.substring(0, 10)
          : "",
        tag: editingTask.tag || "Work",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "MED",
        status: "pending",
        dueDate: "",
        tag: "Work",
      });
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl animate-modal-in overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-slate-800 dark:text-white font-mono">
              {editingTask ? "Edit Task" : "New Task"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 dark:text-muted-fg-dark hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Task title..."
              autoFocus
              className="w-full bg-transparent border-b border-slate-200 dark:border-[#252240] py-2 text-lg font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-[#3d35c8] dark:focus:border-primary-dark transition-colors"
            />
          </div>

          <div>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description..."
              rows={3}
              className="w-full bg-slate-50 dark:bg-[#252240] border border-slate-200 dark:border-transparent rounded-xl px-4 py-3 text-sm text-slate-300 dark:focus:ring-primary-dark placeholder-slate-400 dark:placeholder-muted-fg-dark resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-fg-dark mb-1.5 font-mono">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-[#252240] text-slate-800 dark:text-white border border-slate-200 dark:border-transparent rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3d35c8] dark:focus:ring-primary-dark"
              >
                <option value="LOW">Low</option>
                <option value="MED">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-fg-dark mb-1.5 font-mono">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-[#252240] text-slate-800 dark:text-white border border-slate-200 dark:border-transparent rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3d35c8] dark:focus:ring-primary-dark"
              >
                <option value="pending">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-fg-dark mb-1.5 font-mono">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-[#252240] text-slate-800 dark:text-white border border-slate-200 dark:border-transparent rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3d35c8] dark:focus:ring-primary-dark"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-fg-dark mb-1.5 font-mono">
                Tag
              </label>
              <select
                value={formData.tag}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-[#252240] text-slate-800 dark:text-white border border-slate-200 dark:border-transparent rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#3d35c8] dark:focus:ring-primary-dark"
              >
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg font-bold text-xs font-mono uppercase border border-slate-200 dark:border-[#252240] text-slate-500 dark:text-muted-fg-dark hover:bg-slate-50 dark:hover:bg-[#252240] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="flex-1 py-2.5 rounded-lg font-bold text-xs font-mono uppercase bg-[#3d35c8] dark:bg-primary-dark text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
            >
              {editingTask ? "Save Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
