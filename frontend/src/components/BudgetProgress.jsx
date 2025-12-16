import { useState, useEffect, useRef, useContext } from "react";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";

function BudgetProgress({
  category,
  budget,
  spent,
  budgetId,
  onRefresh
}) {
  const [editing, setEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(budget);
  const { addToast } = useToast();
  const { user } = useContext(AuthContext);

  // 🔧 FIX: sync newLimit when budget changes
  useEffect(() => {
    setNewLimit(budget);
  }, [budget]);

  const alertShownRef = useRef(false);

  const percentage = budget
    ? Math.min(Math.round((spent / budget) * 100), 100)
    : 0;

  /* 🔔 Budget Alert */
  useEffect(() => {
    if (!budget || alertShownRef.current || !user) return;

    if (percentage >= 100) {
      addToast(`Hi ${user.name}, you have exceeded your budget limit for ${category}!`, "error");
      alertShownRef.current = true;
    } else if (percentage >= 80) {
      addToast(`Hi ${user.name}, you have used ${percentage}% of your ${category} budget.`, "error");
      alertShownRef.current = true;
    }
  }, [percentage, category, budget, addToast, user]);

  /* ✏️ Update Budget */
  const updateBudget = async () => {
    if (!newLimit || newLimit <= 0) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/budget/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          category,
          limit: Number(newLimit),
          month: new Date().toISOString().slice(0, 7)
        })
      });

      if (res.ok) {
        addToast("Budget updated successfully");
        setEditing(false);
        alertShownRef.current = false;
        onRefresh && onRefresh(); // 🔥 re-fetch budgets
      } else {
        addToast("Failed to update budget", "error");
      }
    } catch (err) {
      addToast("Failed to update budget", "error");
    }
  };

  /* 🗑 Delete Budget */
  const deleteBudget = async () => {
    if (!window.confirm(`Delete budget for ${category}?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/budget/${budgetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        addToast("Budget deleted successfully");
        onRefresh && onRefresh();
      } else {
        addToast("Failed to delete budget", "error");
      }
    } catch (err) {
      addToast("Failed to delete budget", "error");
    }
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>{category}</b>

        {!editing && (
          <div>
            <button onClick={() => setEditing(true)}>✏️</button>
            <button onClick={deleteBudget} style={{ marginLeft: "6px" }}>
              🗑
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div style={{ marginTop: "6px" }}>
          <input
            type="number"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            style={{ width: "100px", marginRight: "6px" }}
          />
          <button onClick={updateBudget}>Save</button>
          <button
            onClick={() => {
              setEditing(false);
              setNewLimit(budget);
            }}
            style={{ marginLeft: "6px" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <p style={{ margin: "6px 0" }}>
          ₹{spent} / ₹{budget}
        </p>
      )}

      <div style={{ background: "#e5e7eb", borderRadius: "6px", height: "8px" }}>
        <div
          style={{
            width: `${percentage}%`,
            background:
              percentage >= 100
                ? "#dc2626"
                : percentage >= 80
                ? "#f59e0b"
                : "#2563eb",
            height: "8px",
            borderRadius: "6px"
          }}
        />
      </div>

      <small style={{ fontSize: "12px", color: "#6b7280" }}>
        {percentage}% used
      </small>
    </div>
  );
}

export default BudgetProgress;
