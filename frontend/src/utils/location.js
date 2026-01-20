import axios from 'axios'

export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    const res = await axios.get(url, {
      headers: {
        'Accept-Language': 'en'
      }
    })
    return {
      display_name: res.data.display_name,
      raw: res.data,
    }
  } catch (error) {
    console.warn('reverseGeocode failed', error)
    return { display_name: '', raw: null }
  }
}

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by your browser'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      (err) => reject(err),
      options
    )
  })
}
