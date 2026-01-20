import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";
import { color } from "framer-motion";

// --- THE FIX IS IN THIS LINE BELOW ---
export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.forgot}>Forgot Password?</div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.footer}>
          Not a Member?{" "}
          <Link to="/register" style={styles.link}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #673162)",
    padding: "20px"
  },

  card: {
    width: "100%",
    maxWidth: "380px",
    background: "#fbf7f7",
    color: "#000204",
    padding: "35px",
    borderRadius: "14px",
    boxShadow: "0 15px 35px rgba(225, 218, 218, 0.2)",
    textAlign: "center"
  },

  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "black",
    marginBottom: "25px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    color: "red",
    gap: "18px"
  },

  field: {
    textAlign: "left"
  },

  label: {
    fontSize: "13px",
    color: "#020303"
  },

  input: {
    width: "100%",
    border: "none",
    borderBottom: "2px solid #cfd9e3",
    padding: "8px 4px",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#eddae9",
    fontWeight: "bold",
    color: "#0f0000"
  },

  forgot: {
    fontSize: "13px",
    color: "#000409",
    textAlign: "left",
    cursor: "pointer"
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "999px",
    color: "black",
    fontWeight: "600",
    border: "none",
    background: "#cfd4d9",
    fontSize: "15px",
    cursor: "pointer"
  },

  footer: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#030f1f"
  },

  link: {
    color: "#2563eb",
    fontWeight: "600",
    textDecoration: "none"
  },

  error: {
    background: "#dbc0c0",
    color: "#b91c1c",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "12px",
    fontSize: "13px"
  }
};
