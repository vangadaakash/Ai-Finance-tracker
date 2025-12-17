import {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo
} from "react";

import Navbar from "../components/Navbar";
import LoginModal from "../components/LoginModal";
import AddExpenseModal from "../components/AddExpenseModal";
import ExpenseCard from "../components/ExpenseCard";
import Insights from "./Insights";
import { AuthContext } from "../context/AuthContext";
import CategoryPieChart from "../components/CategoryPieChart";
import SpendingTrend from "../components/SpendingTrend";
import BudgetList from "../components/BudgetList";
import BudgetModal from "../components/BudgetModal";
import AIRecommendations from "../components/AIRecommendations";
import ForecastCard from "../components/ForecastCard";
import "./Dashboard.css";
import { API_BASE_URL, AI_BASE_URL } from "../config";

function Dashboard() {
  const { user } = useContext(AuthContext);

  /* ================= STATE ================= */
  const [loginOpen, setLoginOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [refreshBudget, setRefreshBudget] = useState(false);

  /* ================= MONTH ================= */
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  /* ================= FILTERED EXPENSES (MEMOIZED) ================= */
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (!exp?.date) return false;
      const d = new Date(exp.date);
      return (
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` ===
        selectedMonth
      );
    });
  }, [expenses, selectedMonth]);

  /* ================= TOTAL ================= */
  const totalForSelectedMonth = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
  }, [filteredExpenses]);

  /* ================= FETCH EXPENSES ================= */
  const fetchExpenses = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/expense/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch expenses failed", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setAiData(null);
    }
  }, [user]);

  /* ================= AI INSIGHTS (STABLE) ================= */
  useEffect(() => {
    if (!filteredExpenses.length) {
      setAiData(null);
      return;
    }

    let isMounted = true;

    fetch(`${AI_BASE_URL}/insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        expenses: filteredExpenses
      })
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted) setAiData(data);
      })
      .catch(() => {
        if (isMounted) setAiData(null);
      });

    return () => {
      isMounted = false;
    };
  }, [filteredExpenses.length]);

  /* ================= EXPORT PDF ================= */
  const exportPDF = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/report/export?month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) return alert("Failed to export PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Expense_Report_${selectedMonth}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("PDF export failed");
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <div className="dashboard-container">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Financial Dashboard</h1>
            <p className="dashboard-subtitle">
              Track and manage your expenses
            </p>
          </div>

          <div className="header-controls">
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="month-input"
            />
            <button className="export-btn" onClick={exportPDF}>
              Export PDF
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="summary-grid">
  {/* CARD 1 */}
  <div className="summary-card">
    <h4>Total Spent</h4>
    <h2>₹{totalForSelectedMonth.toLocaleString()}</h2>
  </div>

  {/* CARD 2 (THIS WAS MISSING) */}
  <div className="summary-card">
    <h4>Selected Month</h4>
    <h2>₹{totalForSelectedMonth.toLocaleString()}</h2>
    <p>
      {new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      })}
    </p>
  </div>

  {/* CARD 3 */}
  <div className="summary-card">
    <Insights expenses={filteredExpenses} />
  </div>
</div>


        {/* AI RECOMMENDATIONS */}
        <AIRecommendations
          expenses={filteredExpenses}
          onApplyBudget={() => setRefreshBudget(v => !v)}
        />

        {/* FORECAST */}
        {aiData?.forecast && (
          <div className="forecast-section">
            <ForecastCard forecast={aiData.forecast} />
          </div>
        )}

        {/* BUDGET */}
        <div className="budget-section">
          <BudgetModal onSave={() => setRefreshBudget(v => !v)} />
          <BudgetList
            key={refreshBudget}
            expenses={filteredExpenses}
            user={user}
          />
        </div>

       {/* ADD EXPENSE */} <div className="expense-section"> <div className="section-header"> <h2>Add New Expense</h2> <p>Record your daily expenses</p> </div> {user && <AddExpenseModal onSave={fetchExpenses} />} </div>

        {/* CHARTS SECTION */} {user && filteredExpenses.length > 0 && ( <div className="charts-section"> <div className="section-header"> <h2>Analytics & Insights</h2> <p>Visualize your spending patterns</p> </div> <div className="charts-grid"> <div className="chart-card"> <div className="chart-header"> <h3>Category Distribution</h3> <p>Where your money goes</p> </div> <div className="chart-container"> <CategoryPieChart expenses={filteredExpenses} /> </div> </div> <div className="chart-card"> <div className="chart-header"> <h3>Spending Trend</h3> <p>Daily expense patterns</p> </div> <div className="chart-container"> <SpendingTrend expenses={filteredExpenses} /> </div> </div> </div> </div> )}

        {/* EXPENSES LIST */} {user && ( <div className="expenses-section"> <div className="section-header"> <h2>Recent Expenses</h2> <p>Your expense history for the selected month</p> </div> {loading && ( <div className="loading-state"> <div className="loading-spinner"></div> <p>Loading expenses...</p> </div> )} {!loading && filteredExpenses.length === 0 && ( <div className="empty-state"> <svg className="empty-icon" viewBox="0 0 24 24" width="48" height="48"> <path fill="currentColor" d="M19.5,3.09L15,7.59V4H9V10H5V16H11V20H15V16.41L19.5,20.91L20.91,19.5L16.41,15H20V9H14V5H16V8.59L20.91,3.69L19.5,3.09Z" /> </svg> <h3>No expenses for this month</h3> <p>Add your first expense to start tracking</p> </div> )} {!user && ( <div className="login-prompt"> <svg className="login-icon" viewBox="0 0 24 24" width="48" height="48"> <path fill="currentColor" d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" /> </svg> <h3>Please login to view your expenses</h3> <p>Sign in to access your personal expense dashboard</p> <button className="login-btn" onClick={() => setLoginOpen(true)}> Login to Dashboard </button> </div> )} <div className="expenses-list"> {filteredExpenses.map(exp => ( <ExpenseCard key={exp._id} category={exp.category} description={exp.description} amount={exp.amount} date={exp.date} /> ))} </div> </div> )} </div> </> ); } export default Dashboard;