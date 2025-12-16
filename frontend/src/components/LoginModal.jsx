import { useState, useContext } from "react";
import RegisterModal from "./RegisterModal";
import ForgotModal from "./ForgotModal";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const { login } = useContext(AuthContext);

  if (!open) return null;

 const handleLogin = async () => {
  if (!email || !password) {
    setMessage("❌ Please fill all fields");
    return;
  }

  try {
    const response = await loginUser({ email, password });

    console.log("LOGIN API RESPONSE:", response);

    // 🔴 HARD CHECK
    if (!response.token || !response.user) {
      setMessage("❌ Login failed: token missing");
      return;
    }

    // ✅ SAVE USER + TOKEN
    login(response.user, response.token);

    setMessage("✅ Login successful");

    setTimeout(() => {
      onClose();
    }, 600);

  } catch (err) {
    setMessage("❌ Server error");
  }
};


  return (
    <>
      <div style={overlay}>
        <div style={modal} className="modal">
          {/* Close icon */}
          <span style={closeBtn} onClick={onClose}>✖</span>

          <h3>Login</h3>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Remember + Forgot */}
          <div style={row}>
            <label style={checkboxRow}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <span style={link} onClick={() => setShowForgot(true)}>
              Forgot?
            </span>
          </div>

          {message && (
            <p style={{ fontSize: "14px", color: message.includes("❌") ? "red" : "green" }}>
              {message}
            </p>
          )}

          <button className="btn" onClick={handleLogin}>
            Login
          </button>

          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            Not registered?{" "}
            <span style={link} onClick={() => setShowRegister(true)}>
              Register
            </span>
          </p>
        </div>
      </div>

      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onLoginOpen={() => {
          setShowRegister(false);
        }}
      />

      <ForgotModal
        open={showForgot}
        onClose={() => setShowForgot(false)}
      />
    </>
  );
}

/* ---------- STYLES ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: "26px",
  borderRadius: "14px",
  width: "90%",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  position: "relative"
};

const closeBtn = {
  position: "absolute",
  top: "12px",
  right: "14px",
  cursor: "pointer",
  fontSize: "18px",
  color: "#6b7280"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "14px"
};

const checkboxRow = {
  display: "flex",
  alignItems: "center",
  gap: "6px"
};

const link = {
  color: "#2563eb",
  cursor: "pointer"
};

export default LoginModal;
