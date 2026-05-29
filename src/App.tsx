import { useState, useEffect } from 'react';
import type { TaskItem, CreateTaskDto, UpdateTaskDto, TaskStatus } from './types';
import { taskApi } from './services/taskApi';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [summary, setSummary] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, highPriority: 0 });
  const [filter, setFilter] = useState<TaskStatus | 'All'>('All');
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<TaskItem | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [allTasks, sum] = await Promise.all([taskApi.getAll(), taskApi.getSummary()]);
      setTasks(allTasks);
      setSummary(sum);
    } catch {
      setError('Could not connect to backend. Is the API running on port 5246?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (dto: CreateTaskDto | UpdateTaskDto) => {
    try {
      if (editTask) {
        await taskApi.update(editTask.id, dto as UpdateTaskDto);
      } else {
        await taskApi.create(dto as CreateTaskDto);
      }
      setShowForm(false);
      setEditTask(undefined);
      loadData();
    } catch {
      setError('Failed to save task.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    await taskApi.delete(id);
    loadData();
  };

  const handleEdit = (task: TaskItem) => {
    setEditTask(task);
    setShowForm(true);
  };

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>Task Manager</h1>
          <p>Employee Task Tracker</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditTask(undefined); setShowForm(true); }}>
          + New Task
        </button>
      </header>

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-num">{summary.total}</span>
          <span className="summary-label">Total</span>
        </div>
        <div className="summary-card">
          <span className="summary-num todo">{summary.todo}</span>
          <span className="summary-label">Todo</span>
        </div>
        <div className="summary-card">
          <span className="summary-num inprogress">{summary.inProgress}</span>
          <span className="summary-label">In Progress</span>
        </div>
        <div className="summary-card">
          <span className="summary-num done">{summary.done}</span>
          <span className="summary-label">Done</span>
        </div>
        <div className="summary-card">
          <span className="summary-num high">{summary.highPriority}</span>
          <span className="summary-label">High Priority</span>
        </div>
      </div>

      <div className="filter-row">
        {(['All', 'Todo', 'InProgress', 'Done'] as const).map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'InProgress' ? 'In Progress' : f}
          </button>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading">Loading tasks...</div>}

      <div className="task-grid">
        {filtered.map(task => (
          <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        {!loading && filtered.length === 0 && (
          <div className="empty">No tasks found. Create one!</div>
        )}
      </div>

      {showForm && (
        <TaskForm
          task={editTask}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTask(undefined); }}
        />
      )}
    </div>
  );
}
