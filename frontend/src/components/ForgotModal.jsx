function ForgotModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <span style={closeBtn} onClick={onClose}>✖</span>
        <h3>Forgot Password</h3>

        <input placeholder="Enter your email" />

        <button className="btn">Send Reset Link</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1200
};

const modal = {
  background: "#fff",
  padding: "24px",
  borderRadius: "14px",
  width: "90%",
  maxWidth: "360px",
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

export default ForgotModal;
