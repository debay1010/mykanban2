import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskType } from './KanbanBoard';
import { Task } from './Task';
import { AddTaskForm } from './AddTaskForm';

interface ColumnProps {
  id: string;
  title: string;
  tasks: TaskType[];
  onAddTask: (title: string, columnId: string) => void;
}

export function Column({ id, title, tasks, onAddTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`column ${isOver ? 'column--over' : ''}`}
    >
      <h2 className="column-header">{title}</h2>
      <div className="tasks">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      <AddTaskForm onAddTask={(title) => onAddTask(title, id)} />
    </div>
  );
}