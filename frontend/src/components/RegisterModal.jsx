import { useState } from "react";
import { registerUser } from "../services/authService";

function RegisterModal({ open, onClose, onLoginOpen }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!open) return null;

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMessage("❌ Please fill all fields");
      return;
    }

    const res = await registerUser({ name, email, password });

    if (res.message === "User registered successfully") {
      setMessage("✅ Registered successfully");
      setTimeout(() => {
        onClose();
        onLoginOpen();
      }, 1200);
    } else {
      setMessage(res.message || "❌ Registration failed");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal} className="modal">
        <span style={closeBtn} onClick={onClose}>✖</span>

        <h3>Register</h3>

        <input placeholder="Name" onChange={e => setName(e.target.value)} />
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

        {message && <p>{message}</p>}

        <button className="btn" onClick={handleRegister}>
          Register
        </button>

        <p style={{ fontSize: "14px" }}>
          Already have an account?{" "}
          <span style={link} onClick={() => {
            onClose();
            onLoginOpen();
          }}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

/* styles */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1100
};

const modal = {
  background: "#fff",
  padding: "24px",
  borderRadius: "14px",
  width: "90%",
  maxWidth: "380px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  position: "relative"
};

const closeBtn = {
  position: "absolute",
  top: "12px",
  right: "14px",
  cursor: "pointer"
};

const link = {
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: 500
};

export default RegisterModal;
