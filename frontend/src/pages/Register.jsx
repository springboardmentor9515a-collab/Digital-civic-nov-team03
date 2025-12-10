import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import api from '../api'
import LocationPicker from '../components/LocationPicker'
import LocationSearch from "../components/LocationSearch";


export default function Register() {   // 👈 THIS IS THE REQUIRED EXPORT DEFAULT
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    location: 'India',
    role: 'citizen',
  })

  const [locationData, setLocationData] = useState({
    lat: '',
    lon: '',
    address: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate()

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleLocationChange(loc) {
    setLocationData(loc)
    setForm(prev => ({ ...prev, location: loc.address }))
  }

  function validate() {
    const errs = {}
    if (!form.name) errs.name = 'Full name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email'

    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'

    if (!locationData.address && !form.location) errs.location = 'Location required'

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!validate()) return
    setLoading(true)

    try {
      const payload = {
        ...form,
        location: locationData.address || form.location,
        lat: locationData.lat,
        lon: locationData.lon
      }

      await api.post('/api/auth/register', payload)
      navigate('/', { replace: true })

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard activeTab="register">
      <form className="form" onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          value={form.name}
          onChange={e => update('name', e.target.value)}
          placeholder="Jane Doe"
        />
        {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}

        <label>Email</label>
        <input
          value={form.email}
          onChange={e => update('email', e.target.value)}
          type="email"
          placeholder="your@email.com"
        />
        {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => update('password', e.target.value)}
          placeholder="password"
        />
        {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}

        
        <LocationSearch value={locationData} onChange={handleLocationChange} />
        {fieldErrors.location && <div className="field-error">{fieldErrors.location}</div>}

        <label>Registering as</label>
        <select value={form.role} onChange={e => update('role', e.target.value)}>
          <option value="citizen">Citizen</option>
          <option value="official">Public Official</option>
        </select>

        {error && <div className="error">{error}</div>}

        <button className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <div className="footer-link">
          Already have an account? <Link to="/"><b>Sign in.</b></Link>
        </div>
      </form>
    </AuthCard>
  )
}
