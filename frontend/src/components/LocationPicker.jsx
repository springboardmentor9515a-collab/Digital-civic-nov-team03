import React, { useState, useRef, useEffect } from 'react'
import { getCurrentPosition, reverseGeocode } from '../utils/location'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import '../styles/location.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
})

function ClickToPlace({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lon: e.latlng.lng })
    }
  })
  return null
}


export default function LocationPicker({ value = null, onChange, modalOnly = false, open = false, onClose }) {
  const [address, setAddress] = useState(value?.address || '')
  const [pos, setPos] = useState(value ? { lat: value.lat, lon: value.lon } : null)
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false) // internal mode for inline usage
  const [error, setError] = useState(null)
  const markerRef = useRef(null)

  useEffect(() => {
    setAddress(value?.address || '')
    setPos(value && value.lat !== undefined ? { lat: value.lat, lon: value.lon } : null)
  }, [value])

  const modalVisible = modalOnly ? !!open : showMap

  async function handleUseCurrent() {
    setError(null)
    setLoading(true)
    try {
      const { lat, lon } = await getCurrentPosition({ timeout: 10000 })
      setPos({ lat, lon })
      const geo = await reverseGeocode(lat, lon)
      setAddress(geo.display_name || '')
      onChange && onChange({ lat, lon, address: geo.display_name || '' })
    } catch (e) {
      console.warn('getCurrentPosition error', e)
      setError(e.message || 'Unable to get current location')
    } finally {
      setLoading(false)
    }
  }

  async function handleMapConfirm() {
    if (!pos) {
      setError('Please click on the map to choose a location.')
      return
    }
    setLoading(true)
    try {
      const geo = await reverseGeocode(pos.lat, pos.lon)
      const addr = geo.display_name || ''
      setAddress(addr)
      if (!modalOnly) setShowMap(false)
      onChange && onChange({ lat: pos.lat, lon: pos.lon, address: addr })
      if (modalOnly && typeof onClose === 'function') onClose()
    } catch (e) {
      console.warn('reverseGeocode error', e)
      setError('Reverse geocoding failed')
    } finally {
      setLoading(false)
    }
  }

  function handleMarkerDrag(e) {
    const ll = e.target.getLatLng()
    setPos({ lat: ll.lat, lon: ll.lng })
  }

  return (
    <>
      {!modalOnly && (
        <div className="loc-picker">
          <div className="loc-preview">
            <strong>Location:</strong>
            <div className="loc-address">{address || 'No location chosen'}</div>
          </div>

          <div className="loc-buttons">
            <button type="button" className="btn small" onClick={handleUseCurrent} disabled={loading}>
              {loading ? 'Detecting...' : 'Use current location'}
            </button>

            <button type="button" className="btn small" onClick={() => { setShowMap(true); setError(null) }}>
              Pick on map
            </button>
          </div>

          {error && <div className="field-error">{error}</div>}
        </div>
      )}

      {modalVisible && (
        <div className="map-modal" role="dialog" aria-modal="true">
          <div className="map-inner">
            <div className="map-header">
              <button className="btn small" onClick={() => {
                if (!modalOnly) setShowMap(false)
                if (modalOnly && typeof onClose === 'function') onClose()
              }}>Close</button>

              <span>Click on the map to place marker (drag to adjust)</span>

              <button className="btn small primary" onClick={handleMapConfirm} disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm'}
              </button>
            </div>

            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '480px', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />

              <ClickToPlace setPosition={(p) => setPos(p)} />
              {pos && (
                <Marker
                  position={[pos.lat, pos.lon]}
                  draggable={true}
                  eventHandlers={{ dragend: (e) => handleMarkerDrag(e) }}
                  ref={markerRef}
                />
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </>
  )
}
