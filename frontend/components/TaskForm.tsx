import { useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask, Task } from '@/lib/taskService'



export function AddTaskForm({ onTaskAdded }: { onTaskAdded: (task: Task) => void }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) return

        const newTask = await createTask({ title, description })
        onTaskAdded(newTask)
        setTitle('')
        setDescription('')
    }

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
            <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border p-2 flex-1"
                required
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="border p-2 flex-1"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                Add
            </button>
        </form>
    )
}