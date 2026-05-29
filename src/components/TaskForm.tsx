import { useState, useEffect } from 'react';
import type { TaskItem, CreateTaskDto, UpdateTaskDto, TaskPriority, TaskStatus } from '../types';

interface Props {
  task?: TaskItem;
  onSave: (dto: CreateTaskDto | UpdateTaskDto) => void;
  onCancel: () => void;
}

const defaultForm = {
  title: '',
  description: '',
  priority: 'Medium' as TaskPriority,
  assignedTo: '',
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  status: 'Todo' as TaskStatus,
};

export default function TaskForm({ task, onSave, onCancel }: Props) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate.split('T')[0],
        status: task.status,
      });
    }
  }, [task]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.assignedTo.trim()) e.assignedTo = 'Assign to someone';
    if (!form.dueDate) e.dueDate = 'Due date required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" placeholder="What needs to be done?" {...field('title')} />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} placeholder="Add details..." {...field('description')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select {...field('priority')}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            {isEdit && (
              <div className="form-group">
                <label>Status</label>
                <select {...field('status')}>
                  <option value="Todo">Todo</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Assigned To *</label>
              <input type="text" placeholder="Name" {...field('assignedTo')} />
              {errors.assignedTo && <span className="error">{errors.assignedTo}</span>}
            </div>
            <div className="form-group">
              <label>Due Date *</label>
              <input type="date" {...field('dueDate')} />
              {errors.dueDate && <span className="error">{errors.dueDate}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-primary">{isEdit ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
