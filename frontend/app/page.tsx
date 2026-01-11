'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) { router.replace('/dashboard'); }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to AuthDash</h1>
      <p className="mb-6">Please Login or Register to continue</p>
      <div className="space-x-4">
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/auth/register')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Home;