'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuthToken } from '@/lib/api';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    try {
      const res = await api.post('/auth/login', { email, password });
      const token: string = res.data.token
      localStorage.setItem('token', token)
      setAuthToken(token)
      router.replace('/dashboard')
    } catch (error: any) { setError(error.response?.data?.message || 'Login failed') }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default LoginPage