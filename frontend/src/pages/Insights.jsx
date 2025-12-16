import { useEffect, useState, useRef } from "react";
import ForecastCard from "../components/ForecastCard";


function Insights({ expenses }) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const speechRef = useRef(null);
const [speaking, setSpeaking] = useState(false);

const buildSpeechText = () => {
  if (!aiData) return "";

  let text = `${aiData.title}. ${aiData.message}. `;

  if (aiData.weeklyTrend) {
    text += aiData.weeklyTrend.direction === "up"
      ? `You spent ${aiData.weeklyTrend.change} rupees more than last week. `
      : `You spent ${aiData.weeklyTrend.change} rupees less than last week. `;
  }

  if (aiData.budgetUsage !== undefined) {
    text += `You have used ${aiData.budgetUsage} percent of your budget. `;
  }

  if (aiData.savingTip) {
    text += aiData.savingTip;
  }

  return text;
};
const speakInsight = () => {
  if (!window.speechSynthesis || speaking) return;

  const utterance = new SpeechSynthesisUtterance(buildSpeechText());
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.lang = "en-IN";

  utterance.onend = () => setSpeaking(false);

  speechRef.current = utterance;
  setSpeaking(true);
  window.speechSynthesis.speak(utterance);
};

const stopSpeaking = () => {
  window.speechSynthesis.cancel();
  setSpeaking(false);
};
useEffect(() => {
  return () => {
    window.speechSynthesis.cancel();
  };
}, []);


  // 🔒 Prevent repeated popup alerts
  const alertShownRef = useRef(false);

  /* ================= FETCH AI INSIGHTS ================= */
  useEffect(() => {
    if (!expenses || expenses.length === 0) {
      setAiData(null);
      return;
    }

    setLoading(true);

    fetch("http://localhost:5000/api/ai/insights", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data || !data.title) {
          setAiData(null);
        } else {
          setAiData(data);
          alertShownRef.current = false; // reset on new data
        }
      })
      .catch(() => setAiData(null))
      .finally(() => setLoading(false));
  }, [expenses]);

  /* ================= AI ALERT POPUPS ================= */
  useEffect(() => {
    if (!aiData || alertShownRef.current) return;

    if (aiData.budgetUsage >= 100) {
      alert("🚨 You have exceeded your monthly budget!");
      alertShownRef.current = true;
    } else if (aiData.budgetUsage >= 80) {
      alert("⚠️ You are close to your budget limit.");
      alertShownRef.current = true;
    }
  }, [aiData]);

  /* ================= UI ================= */
  return (
    <div className="summary-card">
      <h4>AI Insight</h4>

      <div style={{ marginTop: "8px", display: "flex", gap: "10px" }}>
  {!speaking ? (
    <button
      onClick={speakInsight}
      style={{
        padding: "6px 12px",
        borderRadius: "20px",
        border: "none",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontSize: "13px"
      }}
    >
      🔊 Listen AI Insight
    </button>
  ) : (
    <button
      onClick={stopSpeaking}
      style={{
        padding: "6px 12px",
        borderRadius: "20px",
        border: "none",
        background: "#dc2626",
        color: "white",
        cursor: "pointer",
        fontSize: "13px"
      }}
    >
      ⏹ Stop
    </button>
  )}
</div>


      {loading && <p>Analyzing your spending...</p>}

      {!loading && aiData && (
        <>
          <b>{aiData.title}</b>

          <p
            style={{
              marginTop: "8px",
              whiteSpace: "pre-line",
              color:
                aiData.severity === "danger"
                  ? "#dc2626"
                  : aiData.severity === "warning"
                  ? "#d97706"
                  : "#16a34a"
            }}
          >
            {aiData.message}
          </p>

          <small style={{ color: "#6b7280" }}>
            {aiData.percentage}% of your total expenses
          </small>

          {/* 📈 Weekly trend */}
          {aiData.weeklyTrend && (
            <p style={{ marginTop: "6px", fontSize: "14px" }}>
              {aiData.weeklyTrend.direction === "up"
                ? `📈 You spent ₹${aiData.weeklyTrend.change} more than last week`
                : `📉 You spent ₹${aiData.weeklyTrend.change} less than last week`}
            </p>
          )}

          {/* 📊 Budget usage */}
          {aiData.budgetUsage !== undefined && (
            <p style={{ marginTop: "6px", fontSize: "14px" }}>
              📊 Budget used: <b>{aiData.budgetUsage}%</b>
            </p>
          )}

          {/* 💡 Saving tip */}
          {aiData.savingTip && (
            <p style={{ marginTop: "6px", color: "#2563eb" }}>
              💡 {aiData.savingTip}
            </p>
          )}

          {/* 🤖 Auto budget suggestion */}
          {aiData.autoBudget && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "14px",
                background: "#f1f5f9",
                padding: "8px",
                borderRadius: "8px"
              }}
            >
              🤖 Suggested budget for <b>{aiData.autoBudget.category}</b>:  
              <b> ₹{aiData.autoBudget.suggested}</b>  
              <br />
              <small>{aiData.autoBudget.reason}</small>
            </p>
          )}
        </>
      )}
    {aiData?.forecast && (
  <ForecastCard forecast={aiData.forecast} />
)}


      {!loading && !aiData && (
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          No insights available for this period.
        </p>
      )}
    </div>
    
  );
  
}

export default Insights;
