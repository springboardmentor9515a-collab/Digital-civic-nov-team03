import React from 'react'

export default function Dashboard(){
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return (
    <div style={{padding:28, fontFamily:'Georgia, serif'}}>
      <h1>Dashboard</h1>
      <p>Welcome{user.name ? `, ${user.name}` : ''} — this is a placeholder dashboard.</p>
      <p>Implement real content after auth is working.</p>
    </div>
  )
}
