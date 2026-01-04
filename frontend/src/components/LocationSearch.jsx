import React, { useEffect, useRef, useState } from "react";
import LocationPicker from "./LocationPicker";
import { getCurrentPosition, reverseGeocode } from "../utils/location";
import axios from "axios";
import "../styles/location.css";

export default function LocationSearch({ value, onChange }) {
  const [query, setQuery] = useState(value?.address || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const incoming = value?.address || "";
    if (incoming !== query) {
      setQuery(incoming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.address]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!query || query.length < 1) {
      setSuggestions([]);
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    const ac = new AbortController();
    controllerRef.current = ac;
    const q = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=in&q=${q}`;

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(url, {
          signal: ac.signal,
          headers: { "Accept-Language": "en" },
        });
        const list = res.data.map((item) => ({
          name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));
        setSuggestions(list);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          // ignore
        } else {
          console.warn("Suggestion lookup failed", err);
        }
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, [query]);

  async function handleUseCurrent(e) {
    e && e.stopPropagation();
    setLoading(true);
    try {
      const { lat, lon } = await getCurrentPosition({ timeout: 10000 });
      const geo = await reverseGeocode(lat, lon);
      const address = geo.display_name || `${lat},${lon}`;
      setQuery(address);
      setSuggestions([]);
      onChange && onChange({ lat, lon, address });
      setShowDropdown(false);
    } catch (err) {
      console.warn("Current location failed", err);
      alert("Unable to detect current location");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenMap(e) {
    e && e.stopPropagation();
    setShowMap(true);
    setShowDropdown(false);
  }

  function handleSelectSuggestion(item) {
    setQuery(item.name);
    setSuggestions([]);
    onChange && onChange({ lat: item.lat, lon: item.lon, address: item.name });
    setShowDropdown(false);
  }

  return (
    <div className="location-search" ref={wrapperRef}>
      <label>Location</label>
      <input
        type="text"
        placeholder="Enter your location"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        className="loc-input"
        autoComplete="off"
      />

      {showDropdown && (
        <div className="loc-dropdown" role="listbox" onClick={(e) => e.stopPropagation()}>
          <div
            className="dropdown-option use-current"
            onClick={handleUseCurrent}
            role="option"
          >
            📍 Use current location {loading && "(detecting...)"}
          </div>

          <div
            className="dropdown-option pick-map"
            onClick={handleOpenMap}
            role="option"
          >
            🗺️ Pick from map
          </div>

          <hr />

          {suggestions.length === 0 && query.length > 0 && (
            <div className="dropdown-option">No suggestions</div>
          )}

          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="dropdown-option"
              onClick={() => handleSelectSuggestion(item)}
              role="option"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}

      <LocationPicker
        modalOnly={true}
        open={showMap}
        onClose={() => setShowMap(false)}
        value={value}
        onChange={(loc) => {
          // loc = { lat, lon, address }
          setQuery(loc.address || `${loc.lat},${loc.lon}`);
          onChange && onChange(loc);
          setShowMap(false);
          setShowDropdown(false);
        }}
      />
    </div>
  );
}
