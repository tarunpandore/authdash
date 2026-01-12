'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api, setAuthToken } from '@/lib/api'
import { getTasks, createTask, deleteTask, updateTask, Task } from '@/lib/taskService'
import Sidebar from '@/components/Layout/Sidebar'
import StatsGrid from '@/components/Layout/StatsGrid'
import { MoreHorizontal } from 'lucide-react'

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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // modal form state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

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

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null)
      }
    }
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenuId])

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setCreating(true)
      const newTask = await createTask({ title, description })

      setTasks(prev => [newTask, ...prev])
      setTitle('')
      setDescription('')
      setIsModalOpen(false) // close modal after creation
    } finally {
      setCreating(false)
    }
  }

  if (checkingAuth) {
    return <p className="p-8">Checking authentication...</p>
  }

  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        {/* Header with Logo/Title Separator */}
        <header className="h-16 flex items-center px-6 border-b">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>

        {/* Stats Section */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <StatsGrid
            total={tasks.length}
            complete={tasks.filter(t => t.complete).length}
            pending={tasks.filter(t => !t.complete).length}
          />

          {/* Tasks Table */}
          <div className="mt-6">
            {loadingTasks ? (
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks yet.</p>
            ) : (
          <div className="rounded-xl border border-zinc-800 bg-black text-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/60 border-b border-zinc-800">
                <tr className="text-left text-zinc-400">
                  <th className="px-4 py-3 w-6"></th>
                  <th className="px-4 py-3">Header</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>

              <tbody>
                {tasks.map(task => (
                  <tr
                    key={task._id}
                    className="border-b border-zinc-800 hover:bg-zinc-900/50 transition"
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={task.complete}
                        onChange={async () => {
                          const updated = await updateTask(task._id, {
                            complete: !task.complete,
                          })
                          setTasks(prev =>
                            prev.map(t => (t._id === task._id ? updated : t))
                          )
                        }}
                        className="accent-white"
                      />
                    </td>

                    {/* Header */}
                    <td className="px-4 py-3 font-medium">
                      {task.title}
                      {task.description && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </td>

                    {/* Status - clickable toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={async () => {
                          const updated = await updateTask(task._id, {
                            complete: !task.complete,
                          })
                          setTasks(prev =>
                            prev.map(t => (t._id === task._id ? updated : t))
                          )
                        }}
                        className={`inline-flex cursor-pointer select-none items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors w-24
                          ${
                            task.complete
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-zinc-700/40 text-zinc-300 hover:bg-zinc-700/60'
                          }
                        `}
                        aria-label={
                          task.complete ? 'Mark as In Progress' : 'Mark as Complete'
                        }
                      >
                        {task.complete ? '● Completed' : '◌ In Process'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="relative px-4 py-3 text-right">
                      <button
                        ref={buttonRef}
                        onClick={(e) => {
                          if (openMenuId === task._id) {
                            setOpenMenuId(null)
                          } else {
                            const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                            setMenuPosition({
                              top: rect.bottom + 5,
                              right: window.innerWidth - rect.right
                            })
                            setOpenMenuId(task._id)
                          }
                        }}
                        className="rounded-md p-1 hover:bg-zinc-800"
                        aria-haspopup="true"
                        aria-expanded={openMenuId === task._id}
                        aria-controls={`menu-${task._id}`}
                      >
                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            )}
          </div>
        </div>

        {/* Popup menu portal - outside overflow container */}
        {openMenuId && (
          <div
            ref={menuRef}
            id={`menu-${openMenuId}`}
            role="menu"
            aria-label="Task actions"
            className="fixed rounded-md border border-zinc-700 bg-zinc-900 shadow-lg z-50 w-32"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
              pointerEvents: 'auto'
            }}
          >
            <button
              onClick={async () => {
                await deleteTask(openMenuId)
                setTasks(prev => prev.filter(t => t._id !== openMenuId))
                setOpenMenuId(null)
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-700/20"
              role="menuitem"
            >
              Delete
            </button>
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed right-8 bottom-8 bg-neutral-800 text-white px-5 py-3 rounded-full shadow-lg hover:bg-neutral-700 transition"
        >
          + New Task
        </button>

        {/* Modal for creating task */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="border rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
              <form onSubmit={handleCreateTask} className="flex flex-col space-y-3">
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={3}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Add Task'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
