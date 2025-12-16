import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { API_BASE_URL } from "../config";

function BudgetModal({ onSave }) {
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const { addToast } = useToast();

  const saveBudget = async () => {
    if (!limit || limit <= 0) {
      addToast("Please enter a valid limit", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/budget/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          category,
          limit: Number(limit),
          month: new Date().toISOString().slice(0, 7)
        })
      });

      if (res.ok) {
        addToast("Budget set successfully");
        onSave && onSave();
      } else {
        addToast("Failed to set budget", "error");
      }
    } catch (err) {
      addToast("Failed to set budget", "error");
    }
  };

  return (
    <div className="card">
      <h4>Set Monthly Budget</h4>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Entertainment</option>
      </select>

      <input
        type="number"
        placeholder="Limit (₹)"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
      />

      <button className="btn" onClick={saveBudget}>
        Save Budget
      </button>
    </div>
  );
}

export default BudgetModal;
