import type { TaskItem } from '../types';

interface Props {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: number) => void;
}

const PRIORITY_MAP: Record<string | number, string> = { 0: 'Low', 1: 'Medium', 2: 'High', Low: 'Low', Medium: 'Medium', High: 'High' };
const STATUS_MAP: Record<string | number, string> = { 0: 'Todo', 1: 'InProgress', 2: 'Done', Todo: 'Todo', InProgress: 'InProgress', Done: 'Done' };

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const priority = PRIORITY_MAP[task.priority] ?? String(task.priority);
  const status = STATUS_MAP[task.status] ?? String(task.status);
  const isOverdue = new Date(task.dueDate) < new Date() && status !== 'Done';

  const priorityClass = priority === 'High' ? 'priority-high' : priority === 'Medium' ? 'priority-medium' : 'priority-low';
  const statusClass = status === 'Todo' ? 'status-todo' : status === 'InProgress' ? 'status-inprogress' : 'status-done';
  const statusLabel = status === 'InProgress' ? 'In Progress' : status;

  return (
    <div className={`task-card ${status === 'Done' ? 'task-done' : ''}`}>
      <div className="task-card-header">
        <span className={`badge ${priorityClass}`}>{priority}</span>
        <span className={`badge ${statusClass}`}>{statusLabel}</span>
      </div>
      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta">
        <span className="task-assignee">👤 {task.assignedTo}</span>
        <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
          📅 {new Date(task.dueDate).toLocaleDateString('en-IN')}
          {isOverdue && ' — Overdue'}
        </span>
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}
