import type { TaskItem, CreateTaskDto, UpdateTaskDto, TaskSummary } from '../types';

const BASE_URL = 'http://localhost:5246/api/tasks';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const taskApi = {
  getAll: (): Promise<TaskItem[]> =>
    fetch(BASE_URL).then(r => handleResponse<TaskItem[]>(r)),

  getSummary: (): Promise<TaskSummary> =>
    fetch(`${BASE_URL}/summary`).then(r => handleResponse<TaskSummary>(r)),

  create: (dto: CreateTaskDto): Promise<TaskItem> =>
    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(r => handleResponse<TaskItem>(r)),

  update: (id: number, dto: UpdateTaskDto): Promise<TaskItem> =>
    fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(r => handleResponse<TaskItem>(r)),

  delete: (id: number): Promise<void> =>
    fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
      .then(r => handleResponse<void>(r)),
};
