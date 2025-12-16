import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { API_BASE_URL } from "../config";
function AddExpenseModal({ onSave }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState("");
  const { addToast } = useToast();

  const handleSave = async () => {
    if (!amount || !description || !date) {
      addToast("Please fill all fields", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/expense/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          description,
          category,
          date
        })
      });

      if (!res.ok) {
        addToast("Failed to add expense", "error");
        return;
      }

      addToast("Expense added successfully");

      setOpen(false);
      setAmount("");
      setDescription("");
      setCategory("Other");
      setDate("");

      if (onSave) onSave(); // refresh dashboard data

    } catch (err) {
      addToast("Failed to add expense", "error");
    }
  };

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        + Add Expense
      </button>

      {open && (
        <div style={overlay}>
          <div style={modal} className="modal">
            <h3>Add Expense</h3>

            <div style={formGrid} className="form-grid">
              <input
                style={input}
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <select
                style={input}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>

              <input
                style={{ ...input, gridColumn: "1 / -1" }}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                style={{ ...input, gridColumn: "1 / -1" }}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div style={actions} className="actions">
              <button
                className="btn"
                style={{ background: "#6b7280" }}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: "22px",
  borderRadius: "14px",
  width: "90%",
  maxWidth: "450px"
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px"
};

const input = {
  padding: "10px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  width: "100%"
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "18px"
};

export default AddExpenseModal;
