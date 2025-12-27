import { useEffect, useState } from 'react'
import api from '../api'

export default function PetitionList() {
  const [petitions, setPetitions] = useState([])

  useEffect(() => {
    api.get('/petitions').then(res => setPetitions(res.data))
  }, [])

  const signPetition = async (id) => {
    await api.post(`/petitions/${id}/sign`)
    alert('Signed Successfully')
  }

  return (
    <div>
      <h2>Petitions</h2>
      {petitions.map(p => (
        <div key={p._id}>
          <h4>{p.title}</h4>
          <p>{p.description}</p>
          <p>Status: {p.status}</p>
          <button onClick={() => signPetition(p._id)}>Sign</button>
        </div>
      ))}
    </div>
  )
}
