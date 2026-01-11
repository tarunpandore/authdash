'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, setAuthToken } from '@/lib/api'

type User = {
  id: string
  name: string
  email: string
}

const Dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

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
      .then((res) => {
        setUser(res.data.user)
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.replace('/auth/login')
      })
      .finally(() => {
        setCheckingAuth(false)
      })
  }, [router])

  if (checkingAuth) {
    return <p className="p-8">Checking authentication...</p>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <p>
          Welcome, {user.name} ({user.email})
        </p>
      ) : (
        <p>Unable to load profile</p>
      )}
      <button className='bg-white text-black rounded-md px-4 py-1' onClick={handleLogout}>Log out</button>
    </div>
  )
}


export default Dashboard;