'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, setAuthToken } from '@/lib/api'
import { getTasks, createTask, updateTask, deleteTask, Task } from '@/lib/taskService'

type User = {
  id: string
  name: string
  email: string
}

const Dashboard = () => {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)

  // form state (inlined TaskForm)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  function handleLogout() {
    localStorage.removeItem('token')
    setAuthToken(null)
    router.replace('/')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.replace('/auth/login')
      return
    }

    setAuthToken(token)

    api
      .get('/auth/me')
      .then(async (res) => {
        setUser(res.data.user)
        const taskList = await getTasks()
        setTasks(taskList)
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.replace('/auth/login')
      })
      .finally(() => {
        setCheckingAuth(false)
        setLoadingTasks(false)
      })
  }, [router])

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setCreating(true)
      const newTask = await createTask({ title, description })

      setTasks(prev => [newTask, ...prev])
      setTitle('')
      setDescription('')
    } finally {
      setCreating(false)
    }
  }

  if (checkingAuth) {
    return <p className="p-8">Checking authentication...</p>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {user && (
          <p className="text-sm text-gray-600">
            Welcome, {user.name} ({user.email})
          </p>
        )}
        <button
          className="mt-2 bg-gray-900 text-white rounded-md px-4 py-1"
          onClick={handleLogout}
        >
          Log out
        </button>
      </header>

      {/* Inline Task Form */}
      <form onSubmit={handleCreateTask} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {loadingTasks ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task._id} className="flex justify-between items-center border p-3 rounded">
              <div>
                <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </p>
                {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={async () => {
                    const updated = await updateTask(task._id, { completed: !task.completed })
                    setTasks(prev => prev.map(t => (t._id === task._id ? updated : t)))
                  }}
                />

                {/* Delete button */}
                <button
                  className="text-red-600"
                  onClick={async () => {
                    await deleteTask(task._id)
                    setTasks(prev => prev.filter(t => t._id !== task._id))
                  }}
                >
                  Delete
                </button>

                {/* Update button */}
                <button
                  className="text-blue-600"
                  onClick={async () => {
                    const newTitle = prompt('Enter new title', task.title)
                    if (!newTitle || newTitle.trim() === '') return

                    const updated = await updateTask(task._id, { title: newTitle })
                    setTasks(prev => prev.map(t => (t._id === task._id ? updated : t)))
                  }}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dashboard
