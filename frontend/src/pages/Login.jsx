import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function validate() {
    const errs = {}
    if (!email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Invalid email'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be ≥ 6 characters'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const token = res.data.token || res.data.accessToken || 'demo-token'
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(res.data.user || {}))
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login.')
      setLoading(false)
    }
  }

  return (
    <AuthCard activeTab="login">
      <form onSubmit={handleSubmit} className="form" noValidate>
        <label>Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          type="email"
        />
        {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="password"
        />
        {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}

        {error && <div className="error">{error}</div>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="footer-link">
          Don't have an account? <Link to="/register"><b>Register Now.</b></Link>
        </div>
      </form>
    </AuthCard>
  )
}
