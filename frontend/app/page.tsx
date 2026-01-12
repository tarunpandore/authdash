'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const Home = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.replace('/dashboard')
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return

    try {
      setChecking(true)
      // Check if user exists via backend API
      const res = await api.post('/auth/check-email', { email })
      const exists: boolean = res.data.exists

      if (exists) {
        // User exists → go to login with prefilled email
        router.push(`/auth/login?email=${encodeURIComponent(email)}`)
      } else {
        // User does not exist → go to register with prefilled email
        router.push(`/auth/register?email=${encodeURIComponent(email)}`)
      }
    } catch {
      setError('Failed to verify email. Please try again.')
    } finally {
      setChecking(false)
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
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col space-y-6"
          noValidate
        >
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="mb-4 text-sm opacity-70">
            Enter your email below to create your account
          </p>

          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded bg-gray-900 border border-gray-700 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={checking}
          />

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition disabled:opacity-50"
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Continue'}
          </button>

          {error && (
            <p className="text-red-500 mt-2 text-center" role="alert">
              {error}
            </p>
          )}

          <p className="text-xs opacity-60 mt-6">
            By clicking continue, you agree to our{' '}
            <a href="#" className="underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  )
}

export default Home
