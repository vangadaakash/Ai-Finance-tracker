import { useEffect, useState, useRef } from "react";
import { useToast } from "../context/ToastContext";
import "./AIRecommendations.css";
import { API_BASE_URL } from "../config";
function AIRecommendations({ expenses, onApplyBudget }) {
  const [aiData, setAiData] = useState(null);
  const [index, setIndex] = useState(0);
  const { addToast } = useToast();

  const autoSlideRef = useRef(null);
  const anomalyAlertRef = useRef(false);
  const touchStartX = useRef(0);

  /* ================= FETCH AI DATA ================= */
  useEffect(() => {
    if (!expenses || expenses.length === 0) return;
fetch(`${API_BASE_URL}/api/ai/insights`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify({
    expenses
  })
})
  .then(res => res.json())
  .then(data => setAiData(data))
  .catch(() => setAiData(null));
  }, [expenses]);

  /* ================= ANOMALY POPUP ================= */
  useEffect(() => {
    if (!aiData?.anomaly || anomalyAlertRef.current) return;

    alert(`🚨 AI Alert: ${aiData.anomaly.message}`);
    anomalyAlertRef.current = true;
  }, [aiData]);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!aiData || !aiData.autoBudget) return null;


    autoSlideRef.current = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 4000);

    return () => clearInterval(autoSlideRef.current);
  }, [aiData]);

  if (!aiData) return null;

  /* ================= APPLY AI BUDGET ================= */
  const applyAIBudget = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/budget`
, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          category: aiData.autoBudget.category,
          limit: aiData.autoBudget.suggested,
          month: new Date().toISOString().slice(0, 7)
        })
      });

      if (res.ok) {
        addToast("AI budget applied successfully 🤖");
        onApplyBudget && onApplyBudget();
      } else {
        addToast("Failed to apply AI budget", "error");
      }
    } catch {
      addToast("Failed to apply AI budget", "error");
    }
  };

  /* ================= AI HEALTH SCORE ================= */
  const healthScore = Math.max(
    100 - aiData.percentage,
    20
  );

  /* ================= SLIDES ================= */
  const slides = [
    {
      icon: "🤖",
      title: "AI Budget Recommendation",
      content: (
        <>
          <p>Suggested budget for <b>{aiData.autoBudget.category}</b></p>
          <h2>₹{aiData.autoBudget.suggested}</h2>
          <button className="apply-btn" onClick={applyAIBudget}>
            Apply AI Budget
          </button>
        </>
      )
    },
    {
      icon: "🔮",
      title: "Next Month Forecast",
      content: aiData.forecast ? (
        <>
          <h2>₹{aiData.forecast.nextMonthEstimate}</h2>
          <p>{aiData.forecast.message}</p>
        </>
      ) : (
        "Not enough data to predict next month"
      )
    },
    {
      icon: "🚨",
      title: "Anomaly Detection",
      content: aiData.anomaly ? (
        <>
          <b>Spending Spike Detected</b>
          <p>{aiData.anomaly.message}</p>
        </>
      ) : (
        "No unusual spending detected 🎉"
      )
    },
    {
      icon: "📊",
      title: "AI Health Score",
      content: (
        <>
          <h2>{healthScore}/100</h2>
          <p>
            {healthScore >= 70
              ? "Great financial control 👍"
              : "Needs better spending discipline"}
          </p>
        </>
      )
    },
    {
      icon: "💡",
      title: "Smart Saving Tip",
      content: aiData.savingTip
    }
  ];

  /* ================= SWIPE HANDLERS ================= */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) setIndex(i => (i + 1) % slides.length);
    if (diff < -50) setIndex(i => (i - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className="ai-reco-wrapper"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h2 className="ai-reco-heading">AI Recommendations</h2>

      <div className="ai-reco-card">
        <div className="ai-reco-icon">{slides[index].icon}</div>
        <h4>{slides[index].title}</h4>
        <div className="ai-reco-content">{slides[index].content}</div>
      </div>

      <div className="ai-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default AIRecommendations;
