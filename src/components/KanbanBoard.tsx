'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Column } from './Column';
import { Task } from './Task';

export interface TaskType {
  id: string;
  title: string;
  columnId: string;
}

export interface ColumnType {
  id: string;
  title: string;
  tasks: TaskType[];
}

const initialColumns: ColumnType[] = [
  { id: 'todo', title: 'To-do', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
  { id: 'archive', title: 'Archive', tasks: [] },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = findTaskById(activeId);
    const overTask = findTaskById(overId);

    if (!activeTask) return;

    // Dropping on a column
    if (isColumnId(overId)) {
      const overColumnId = overId;

      // If task is already in this column, do nothing
      if (activeTask.columnId === overColumnId) return;

      setColumns(prevColumns => {
        const newColumns = prevColumns.map(column => {
          // Remove from old column
          if (column.id === activeTask.columnId) {
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== activeId),
            };
          }
          // Add to new column
          if (column.id === overColumnId) {
            return {
              ...column,
              tasks: [...column.tasks, { ...activeTask, columnId: overColumnId }],
            };
          }
          return column;
        });
        return newColumns;
      });
    }

    // Dropping on another task
    if (overTask && activeTask.columnId === overTask.columnId) {
      // Same column reordering
      setColumns(prevColumns => {
        const column = prevColumns.find(col => col.id === activeTask.columnId);
        if (!column) return prevColumns;

        const oldIndex = column.tasks.findIndex(task => task.id === activeId);
        const newIndex = column.tasks.findIndex(task => task.id === overId);

        const newTasks = arrayMove(column.tasks, oldIndex, newIndex);

        return prevColumns.map(col =>
          col.id === activeTask.columnId ? { ...col, tasks: newTasks } : col
        );
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };

  const findTaskById = (id: string): TaskType | undefined => {
    for (const column of columns) {
      const task = column.tasks.find(task => task.id === id);
      if (task) return task;
    }
    return undefined;
  };

  const isColumnId = (id: string): boolean => {
    return columns.some(column => column.id === id);
  };

  const addTask = (title: string, columnId: string) => {
    const newTask: TaskType = {
      id: `task-${Date.now()}`,
      title,
      columnId,
    };

    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  };

  return (
    <div className="kanban-board">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="columns">
          {columns.map(column => (
            <SortableContext
              key={column.id}
              items={column.tasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <Column
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                onAddTask={addTask}
              />
            </SortableContext>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <Task task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}