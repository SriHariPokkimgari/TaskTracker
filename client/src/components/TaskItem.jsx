import { useState } from "react";

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  viewMode,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const priorityColors = {
    LOW: { text: "text-emerald-500", dot: "bg-emerald-500" },
    MED: { text: "text-amber-500", dot: "bg-amber-500" },
    HIGH: { text: "text-red-500", dot: "bg-red-500" },
  };

  const priorityConfig = priorityColors[task.priority] || priorityColors.MED;

  const handleStatusCycle = () => {
    let nextStatus = "pending";
    if (task.status === "pending") nextStatus = "in-progress";
    else if (task.status === "in-progress") nextStatus = "completed";
    onStatusChange(task._id, nextStatus);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } catch {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === "completed") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const overdue = isOverdue();

  return (
    <div
      className={`task-item group relative rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-[rgba(232,230,240,0.1)] p-4 sm:p-5 hover:border-[#3d35c8]/30 dark:hover:border-[#6b63e8]/30 transition-all duration-200 animate-fade-in-up
        ${task.status === "completed" ? "opacity-60" : ""}
        ${isDeleting ? "opacity-30 scale-95" : ""}`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleStatusCycle}
          className="mt-0.5 shrink-0 transition-transform hover:scale-105 cursor-pointer"
          title="Cycle status"
        >
          {task.status === "completed" ? (
            // Filled circle with checkmark
            <div className="w-[20px] h-[20px] rounded-full bg-[#3d35c8] dark:bg-[#6b63e8] flex items-center justify-center text-white">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : task.status === "in-progress" ? (
            // Clock icon + primary border
            <div className="w-[20px] h-[20px] rounded-full border-2 border-[#3d35c8] dark:border-[#6b63e8] flex items-center justify-center text-[#3d35c8] dark:text-[#6b63e8]">
              <svg
                className="w-3.5 h-3.5"
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
            <div className="w-[20px] h-[20px] rounded-full border-2 border-slate-300 dark:border-[#8c89a8] hover:border-[#3d35c8] dark:hover:border-[#6b63e8] transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
          <h3
            className={`font-semibold text-slate-800 dark:text-white text-sm cursor-pointer hover:text-[#3d35c8] dark:hover:text-[#6b63e8] transition-colors
              ${task.status === "completed" ? "line-through text-slate-400 dark:text-[#8c89a8]" : ""}`}
          >
            {task.title}
          </h3>

          {viewMode === "list" && task.description && (
            <p
              className={`text-xs text-slate-500 dark:text-[#8c89a8] mt-1.5 line-clamp-2 leading-relaxed font-sans
                ${task.status === "completed" ? "line-through opacity-70" : ""}`}
            >
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono tracking-wider ${priorityConfig.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`}
              />
              {task.priority}
            </span>

            {task.tag && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-mono text-slate-500 dark:text-[#8c89a8] bg-slate-100 dark:bg-[#252240] px-2 py-0.5 rounded">
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M6 20a1 1 0 001-1v-5a1 1 0 00-1-1H3a1 1 0 00-1 1v5a1 1 0 001 1h3zm10-10a1 1 0 011-1h3a1 1 0 011 1v5a1 1 0 01-1 1h-3a1 1 0 01-1-1v-5z"
                  />
                </svg>
                {task.tag}
              </span>
            )}

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-semibold font-mono px-2 py-0.5 rounded
                  ${
                    overdue
                      ? "bg-red-500/10 text-red-500"
                      : "text-slate-500 dark:text-[#8c89a8] bg-slate-100 dark:bg-[#252240]"
                  }`}
              >
                {overdue ? (
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
                {formatDate(task.dueDate)}
                {overdue && " OVERDUE"}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 max-sm:opacity-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!showConfirm ? (
            <>
              {/* Edit/Update Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-1.5 rounded text-slate-400 dark:text-[#8c89a8] hover:text-[#3d35c8] dark:hover:text-[#6b63e8] hover:bg-slate-100 dark:hover:bg-[#252240] transition-all cursor-pointer"
                title="Edit Task"
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
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                className="p-1.5 rounded text-slate-400 dark:text-[#8c89a8] hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                title="Delete Task"
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
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div
              className="flex items-center gap-1.5 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white bg-red-500 hover:bg-red-600 transition-all cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-slate-500 bg-slate-100 dark:bg-[#252240] hover:bg-slate-200 dark:hover:bg-[#252240] dark:text-[#e8e6f0] transition-all cursor-pointer"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
