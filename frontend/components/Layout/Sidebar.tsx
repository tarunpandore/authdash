'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { api, setAuthToken } from '@/lib/api'
import {
  LayoutDashboard,
  MoreVertical, 
  LogOut,
} from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


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
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.replace('/auth/login')
      })
  }, [router])

  return (
    <aside className="w-64 border-r flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-lg font-semibold">AuthDash</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
                ${active
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p
          className={'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition'}
        >More Options comming soon...
        </p>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-gray-200" />
          <div className="flex-1">
            {user && (
              <p className="text-sm font-medium">{user.name}</p>
            )}
            {user && (
              <p className="text-xs text-gray-500">{user.email}</p>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            {/* 3 dots button */}
            <button
              onClick={() => setOpen(prev => !prev)}
              className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>

            {/* Popup */}
            {open && (
              <div className="absolute bottom-10 w-44 rounded-xl bg-zinc-900 text-white shadow-xl border border-zinc-800 z-50">
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-zinc-800"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                  <span className="text-red-400">Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
