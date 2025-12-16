import { useEffect, useState, useCallback } from "react";
import BudgetProgress from "./BudgetProgress";

function BudgetList({ expenses = [], user }) {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");

  // ✅ Extracted reusable function
  const fetchBudgets = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view budgets.");
      setBudgets([]);
      return;
    }

    fetch(`${API_BASE_URL}/api/budget/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Unauthorized");
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setBudgets(data);
          setError("");
        } else {
          setBudgets([]);
        }
      })
      .catch(err => {
        console.error("Budget fetch error:", err.message);
        setError(err.message);
        setBudgets([]);
      });
  }, []);

  // ✅ Fetch on load
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // ✅ Fetch when user changes
  useEffect(() => {
    fetchBudgets();
  }, [user, fetchBudgets]);

  if (error) {
    return (
      <div className="card">
        <h4>Monthly Budgets</h4>
        <p style={{ color: "#dc2626", fontSize: "14px" }}>{error}</p>
      </div>
    );
  }

  if (!Array.isArray(budgets) || budgets.length === 0) return null;

  // 🔹 Calculate spent per category
  const spentByCategory = {};
  expenses.forEach(e => {
    spentByCategory[e.category] =
      (spentByCategory[e.category] || 0) + Number(e.amount || 0);
  });

  return (
    <div className="card">
      <h4>Monthly Budgets</h4>

      {budgets.map(b => (
        <BudgetProgress
  key={b._id}
  budgetId={b._id}
  category={b.category}
  budget={b.limit}
  spent={spentByCategory[b.category] || 0}
  onRefresh={fetchBudgets}
/>

      ))}
    </div>
  );
}

export default BudgetList;
