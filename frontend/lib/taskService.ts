import { api } from './api';

// Task type
export type Task = {
    _id: string
    title: string
    description: string
    complete: boolean
}

// API call to get all tasks
export async function getTasks(): Promise<Task[]> {
    const res = await api.get('/tasks')
    return res.data
}

// API call to create a new task
export async function createTask(data: { title: string, description: string }): Promise<Task> {
    const res = await api.post('/tasks', data)
    return res.data
}

// API call to update a task
export async function updateTask(id: string, data: Partial<{ title: string, description: string, complete: boolean }>): Promise<Task> {
    const res = await api.put(`/tasks/${id}`, data)
    return res.data
}

// API call to delete a task
export async function deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
}