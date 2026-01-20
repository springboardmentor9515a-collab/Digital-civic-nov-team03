import { useState, useContext } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import { User, Mail, Lock, MapPin, Briefcase } from "lucide-react";

// --- MAP IMPORTS ---
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icon missing in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const Register = () => {
  const navigate = useNavigate();
  // const { register } = useContext(AuthContext);
  const { register, login } = useContext(AuthContext);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
    location: ""
  });

  
  // Map State (Default: Hyderabad)
  const [mapCoords, setMapCoords] = useState([17.3850, 78.4867]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- MAP COMPONENT TO HANDLE CLICKS ---
  function LocationMarker() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setMapCoords([lat, lng]); // Move marker visual

        // Reverse Geocoding (Get City Name)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.county || "Selected Location";

          // Auto-fill the existing location input
          setFormData((prev) => ({ ...prev, location: city }));
        } catch (error) {
          // Fallback if API fails
          setFormData((prev) => ({ ...prev, location: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
        }
      },
    });

    return mapCoords === null ? null : (
      <Marker position={mapCoords}></Marker>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("FORM DATA 👉", formData);
   
    try {
  await register(formData);
  navigate("/dashboard");
} catch (err) {
  const message = err.response?.data?.message;

  if (message === "User already exists") {
    // auto login if already registered
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (loginErr) {
      setError("User exists, but password is incorrect");
    }
  } else {
    setError(message || "Registration Failed");
  }
}

  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* LEFT SIDE */}
        <div style={styles.left}>
          <h2 style={styles.title}>Sign Up</h2>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <User size={18} style={styles.icon} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <Lock size={18} style={styles.icon} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <Briefcase size={18} style={styles.icon} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="citizen">Citizen</option>
                <option value="official">Public Official</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <MapPin size={18} style={styles.icon} />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* MAP (same logic, better look) */}
            <div style={styles.mapWrapper}>
              <MapContainer center={mapCoords} zoom={11} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <button type="submit" onClick={handleSubmit} style={styles.mainButton}>
            Sign Up
          </button>

          <p style={styles.footerText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>Log in</Link>
          </p>

        </div>

      </div>
    </div>
  );

};


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #818cf8, #a78bfa, #60a5fa)",
    padding: "20px"
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    padding: "40px",
    borderRadius: "30px",
    background: "rgba(102, 25, 128, 0.3)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 40px rgba(36, 7, 7, 0.15)"
  },

  left: {},
  right: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "25px"
  },

  form: { display: "flex", flexDirection: "column", gap: "16px" },

  inputGroup: { position: "relative" },

  icon: {
    position: "absolute",
    top: "50%",
    left: "16px",
    transform: "translateY(-50%)",
    color: "#4f46e5"
  },

  input: {
    width: "100%",
    padding: "14px 18px 14px 45px",
    borderRadius: "999px",
    border: "none",
    outline: "none",
    color: "black",
    fontWeight: "bold",
    background: "rgba(239, 230, 230, 0.8)",
    fontSize: "15px"
  },

  mapWrapper: {
    height: "160px",
    borderRadius: "16px",
    overflow: "hidden"
  },

  mainButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "999px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    marginBottom: "16px"
  },

  divider: {
    margin: "16px 0",
    color: "#444",
    fontSize: "14px"
  },

  socialBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "999px",
    border: "1px solid #ddd",
    background: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    marginBottom: "10px"
  },

  footerText: { fontSize: "14px", marginBottom: "10px" },
  link: { fontWeight: "600", color: "#000", textDecoration: "none" },

  errorBox: {
    background: "#ddc5c5",
    padding: "10px",
    color: "#b91c1c",
    borderRadius: "10px",
    marginBottom: "10px"
  }
};


export default Register;