'use client'

import { useState } from 'react'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { login } from './actions'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setError('')
    setLoading(true)

    try {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-white/50" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
            placeholder="admin@deonpay.mx"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-white/50" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
