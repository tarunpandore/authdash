'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api, setAuthToken } from '@/lib/api'

const LoginPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailParam)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (emailParam) setEmail(emailParam)
  }, [emailParam])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    try {
      const res = await api.post('/auth/login', { email, password })
      const token: string = res.data.token
      localStorage.setItem('token', token)
      setAuthToken(token)
      router.replace('/dashboard')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="flex flex-col justify-between bg-black text-white p-10 w-1/2 rounded-l-lg">
        <div>
          <h1 className="text-xl font-semibold mb-8">AuthDash</h1>
        </div>
        <blockquote className="text-sm opacity-70">
          "Primetrade has revolutionized my trading strategy with real-time insights
          and seamless execution. I've never felt more confident in my investment decisions." – Marcus Chen
        </blockquote>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center items-center bg-black w-1/2 rounded-r-lg p-10 text-white relative">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md flex flex-col space-y-6"
          noValidate
        >
          <h2 className="text-2xl font-bold mb-2">Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded bg-gray-900 border border-gray-700 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded bg-gray-900 border border-gray-700 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition"
          >
            Login
          </button>

          {error && (
            <p className="text-red-500 mt-2 text-center" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default LoginPage
