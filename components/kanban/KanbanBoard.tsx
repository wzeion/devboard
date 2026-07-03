"use client";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Trash2, Calendar, Flag, GripVertical } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string | null;
}

interface Props {
  tasks: Task[];
  onStatusChange: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  LOW: "text-emerald-500",
  MEDIUM: "text-amber-400",
  HIGH: "text-red-400",
};

const priorityBg = {
  LOW: "bg-emerald-500/10",
  MEDIUM: "bg-amber-400/10",
  HIGH: "bg-red-400/10",
};

const columns = [
  { id: "TODO", label: "To Do", accent: "border-t-gray-400" },
  { id: "IN_PROGRESS", label: "In Progress", accent: "border-t-amber-400" },
  { id: "DONE", label: "Done", accent: "border-t-emerald-500" },
] as const;

export default function KanbanBoard({ tasks, onStatusChange, onDelete }: Props) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId
          ? { ...t, status: newStatus as Task["status"] }
          : t
      )
    );

    onStatusChange(draggableId, newStatus);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const columnTasks = localTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`bg-white dark:bg-[#161b22] rounded-lg border border-gray-200 dark:border-[#30363d] border-t-2 ${col.accent}`}
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-[#21262d]">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                    {col.label}
                  </h2>
                  <span className="text-xs bg-gray-100 dark:bg-[#21262d] text-gray-500 dark:text-[#8b949e] px-2 py-0.5 rounded-full font-medium">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 min-h-[200px] transition-all duration-150 rounded-b-lg ${
                      snapshot.isDraggingOver
                        ? "bg-emerald-500/5 border-2 border-dashed border-emerald-500/30"
                        : "border-2 border-transparent"
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group bg-gray-50 dark:bg-[#0d1117] rounded-md p-3.5 mb-2.5 border transition-all ${
                              snapshot.isDragging
                                ? "border-emerald-500 shadow-lg shadow-emerald-500/10 rotate-1 scale-105"
                                : "border-gray-200 dark:border-[#30363d] hover:border-gray-300 dark:hover:border-[#484f58]"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="text-gray-300 dark:text-[#30363d] hover:text-gray-400 dark:hover:text-[#8b949e] mt-0.5 cursor-grab active:cursor-grabbing transition-colors"
                              >
                                <GripVertical size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <h3 className="font-medium text-sm text-gray-900 dark:text-[#e6edf3] leading-snug">
                                    {task.title}
                                  </h3>
                                  <button
                                    onClick={() => onDelete(task.id)}
                                    className="text-gray-300 dark:text-[#30363d] hover:text-red-400 transition shrink-0 opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                                {task.description && (
                                  <p className="text-gray-400 dark:text-[#8b949e] text-xs mb-2.5 leading-relaxed">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${priorityColors[task.priority]} ${priorityBg[task.priority]} font-medium`}
                                  >
                                    <Flag size={9} />
                                    {task.priority}
                                  </span>
                                  {task.dueDate && (
                                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-[#8b949e]">
                                      <Calendar size={10} />
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}