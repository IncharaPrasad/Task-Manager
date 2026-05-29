export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'InProgress' | 'Done';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
}

export interface UpdateTaskDto extends CreateTaskDto {
  status: TaskStatus;
}

export interface TaskSummary {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  highPriority: number;
}
