import React, { useState, useEffect } from "react";
import LocationPicker from "./LocationPicker";
import { getCurrentPosition, reverseGeocode } from "../utils/location";
import axios from "axios";

export default function LocationSearch({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=in&q=${query}`;
        const res = await axios.get(url, {
          headers: { "Accept-Language": "en" }
        });

        const list = res.data.map(item => ({
          name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));

        setSuggestions(list);
      } catch (err) {
        console.warn("Suggestion lookup failed", err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300); // debounce typing
    return () => clearTimeout(delay);
  }, [query]);

  async function handleUseCurrent() {
    try {
      setLoading(true);
      const { lat, lon } = await getCurrentPosition();
      const geo = await reverseGeocode(lat, lon);
      onChange({
        lat,
        lon,
        address: geo.display_name
      });
      setQuery(geo.display_name);
      setSuggestions([]);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  }

  function selectSuggestion(item) {
    setQuery(item.name);
    onChange({
      lat: item.lat,
      lon: item.lon,
      address: item.name
    });
    setSuggestions([]);
  }

  return (
    <div className="location-search">

      <label>Location</label>
      <input
        type="text"
        placeholder="Enter your location"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="loc-input"
      />

      {suggestions.length > 0 && (
        <div className="loc-dropdown">

          <div className="dropdown-option use-current" onClick={handleUseCurrent}>
            📍 Use current location {loading && "(detecting...)"}
          </div>

          <div className="dropdown-option pick-map" onClick={() => setShowMap(true)}>
            🗺️ Pick from map
          </div>

          <hr />

          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="dropdown-option"
              onClick={() => selectSuggestion(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      {/* MAP MODAL */}
      {showMap && (
        <LocationPicker
          value={value}
          onChange={(loc) => {
            setQuery(loc.address);
            onChange(loc);
            setShowMap(false);
          }}
        />
      )}
    </div>
  );
}
