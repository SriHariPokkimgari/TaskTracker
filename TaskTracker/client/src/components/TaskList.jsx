import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  viewMode,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div
        className={
          viewMode === "board"
            ? "grid grid-cols-1 md:grid-cols-3 gap-6"
            : "space-y-3"
        }
      >
        {[...Array(viewMode === "board" ? 3 : 4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-5 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#252240] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-[#252240] rounded w-3/5" />
                {viewMode === "list" && (
                  <div className="h-3 bg-slate-100 dark:bg-[#252240] rounded w-full" />
                )}
                <div className="h-3 bg-slate-100 dark:bg-[#252240] rounded w-2/3 pt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === "board") {
    const columns = [
      {
        id: "pending",
        name: "TO DO",
        color: "border-slate-300 dark:border-[#3d3a55]",
      },
      {
        id: "in-progress",
        name: "IN PROGRESS",
        color: "border-indigo-400 dark:border-indigo-500",
      },
      {
        id: "completed",
        name: "DONE",
        color: "border-emerald-400 dark:border-emerald-500",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-slate-100/60 dark:bg-[#16132a] border border-[rgba(26,24,37,0.06)] dark:border-[#252240] rounded-xl p-4 min-h-100 flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#252240]">
                <h3 className="text-xs font-bold font-mono tracking-wider text-slate-700 dark:text-secondary-fg-dark flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${col.id === "pending" ? "bg-amber-500" : col.id === "in-progress" ? "bg-blue-500" : "bg-emerald-500"}`}
                  />
                  {col.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-200 dark:bg-[#252240] text-slate-600 dark:text-muted-fg-dark">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-10">
                    <span className="text-xs text-slate-400 dark:text-muted-fg-dark font-mono italic">
                      Empty Column
                    </span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                      viewMode="board"
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl animate-fade-in">
        <div className="text-4xl mb-3">📝</div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-white font-mono">
          No tasks found
        </h3>
        <p className="text-xs text-slate-400 dark:text-muted-fg-dark mt-1">
          Click + NEW to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          viewMode="list"
        />
      ))}
    </div>
  );
}
