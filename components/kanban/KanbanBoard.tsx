"use client";
import { useState } from "react";
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
  LOW: "text-green-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-red-400",
};

const priorityBg = {
  LOW: "bg-green-400/10",
  MEDIUM: "bg-yellow-400/10",
  HIGH: "bg-red-400/10",
};

const columns = [
  { id: "TODO", label: "To Do", color: "border-t-gray-500" },
  { id: "IN_PROGRESS", label: "In Progress", color: "border-t-blue-500" },
  { id: "DONE", label: "Done", color: "border-t-green-500" },
] as const;

export default function KanbanBoard({ tasks, onStatusChange, onDelete }: Props) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Sync when parent updates
  if (JSON.stringify(tasks) !== JSON.stringify(localTasks)) {
    setLocalTasks(tasks);
  }

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    // Optimistic update
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus as Task["status"] } : t
      )
    );

    onStatusChange(draggableId, newStatus);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const columnTasks = localTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`bg-gray-900 rounded-xl border border-gray-800 border-t-2 ${col.color}`}
            >
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-200">{col.label}</h2>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 min-h-[200px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-gray-800/50" : ""
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-gray-800 rounded-lg p-4 mb-3 border transition-all ${
                              snapshot.isDragging
                                ? "border-blue-500 shadow-lg shadow-blue-500/20 rotate-1"
                                : "border-gray-700 hover:border-gray-600"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="text-gray-600 hover:text-gray-400 mt-0.5 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="font-medium text-sm text-white leading-snug">
                                    {task.title}
                                  </h3>
                                  <button
                                    onClick={() => onDelete(task.id)}
                                    className="text-gray-600 hover:text-red-400 transition shrink-0"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                {task.description && (
                                  <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]} ${priorityBg[task.priority]}`}
                                  >
                                    <Flag size={10} />
                                    {task.priority}
                                  </span>
                                  {task.dueDate && (
                                    <span className="flex items-center gap-1 text-xs text-gray-500">
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