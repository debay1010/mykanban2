import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskType } from './KanbanBoard';

interface TaskProps {
  task: TaskType;
  isDragging?: boolean;
}

export function Task({ task, isDragging }: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task"
      {...attributes}
      {...listeners}
    >
      <div className="task-content">
        {task.title}
      </div>
    </div>
  );
}