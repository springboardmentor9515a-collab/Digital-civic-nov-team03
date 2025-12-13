import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // token delete
    navigate("/"); // login page
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome to Dashboard 🎉</h1>
        <p style={styles.text}>
          You have successfully logged in.
        </p>

        <div style={styles.infoBox}>
          <p><strong>Status:</strong> Logged In ✅</p>
          <p><strong>Role:</strong> User</p>
        </div>

        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "10px",
    color: "#333",
  },
  text: {
    marginBottom: "20px",
    color: "#555",
  },
  infoBox: {
    background: "#f0f0f0",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "20px",
    textAlign: "left",
  },
  button: {
    padding: "10px 20px",
    background: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
