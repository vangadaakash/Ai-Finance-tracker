from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta, timezone
from collections import defaultdict

app = FastAPI()

# ---------- MODELS ----------

class Expense(BaseModel):
    category: str
    amount: float
    date: datetime

class InsightRequest(BaseModel):
    expenses: List[Expense]

# ---------- AI INSIGHTS ----------

@app.post("/insights")
def generate_insights(data: InsightRequest):

    if not data.expenses:
        return {
            "title": "No insights yet",
            "message": "Start adding expenses to get smart insights.",
            "percentage": 0,
            "severity": "info",
            "recommendations": [],
            "popup": None
        }

    # ---------- TOTAL & CATEGORY ----------
    total = sum(e.amount for e in data.expenses)

    category_totals = {}
    for e in data.expenses:
        category_totals[e.category] = category_totals.get(e.category, 0) + e.amount

    top_category = max(category_totals, key=category_totals.get)
    top_amount = category_totals[top_category]
    percentage = round((top_amount / total) * 100)

    # ---------- WEEKLY COMPARISON ----------
    now = datetime.now(timezone.utc)
    last_7_days = now - timedelta(days=7)
    prev_7_days = now - timedelta(days=14)

    this_week = 0
    last_week = 0

    for e in data.expenses:
        d = e.date.astimezone(timezone.utc)
        if d >= last_7_days:
            this_week += e.amount
        elif prev_7_days <= d < last_7_days:
            last_week += e.amount

    weekly_trend = None
    if last_week > 0:
        diff = round(this_week - last_week)
        weekly_trend = {
            "change": abs(diff),
            "direction": "up" if diff > 0 else "down"
        }

    # ---------- SAVING LOGIC ----------
    suggested_saving = round(top_amount * 0.15)

    # ---------- AI RECOMMENDATIONS ----------
    recommendations = []

    recommendations.append({
        "icon": "💡",
        "title": "Reduce top expense",
        "text": f"Reducing {top_category.lower()} spending by ₹{suggested_saving} could improve savings."
    })

    if percentage >= 50:
        recommendations.append({
            "icon": "⚠️",
            "title": "High spending alert",
            "text": f"{top_category} alone takes {percentage}% of your budget. Set a strict limit."
        })

    if weekly_trend and weekly_trend["direction"] == "up":
        recommendations.append({
            "icon": "📈",
            "title": "Spending increased",
            "text": "Your weekly spending has increased. Review recent transactions."
        })

    if total >= 5000:
        recommendations.append({
            "icon": "📊",
            "title": "Monthly review",
            "text": "Your expenses are high this month. Try setting daily limits."
        })

    # ---------- POPUP LOGIC ----------
    popup = None
    if percentage >= 80:
        popup = {
            "type": "danger" if percentage >= 100 else "warning",
            "message": (
                f"You used {percentage}% of your spending on {top_category}. "
                f"Control expenses to avoid overspending."
            )
        }

    # ---------- AUTO-BUDGET ----------
    recommended_budget = round(top_amount * 0.9)

    # ---------- ANOMALY DETECTION ----------
    daily_totals = defaultdict(float)

    for e in data.expenses:
        day = e.date.date()
        daily_totals[day] += e.amount

    sorted_days = sorted(daily_totals.keys(), reverse=True)
    anomaly = None

    if len(sorted_days) >= 8:
        last_3_days = sorted_days[:3]
        prev_7_days = sorted_days[3:10]

        last_3_avg = sum(daily_totals[d] for d in last_3_days) / 3
        prev_7_avg = sum(daily_totals[d] for d in prev_7_days) / 7

        if prev_7_avg > 0 and last_3_avg >= prev_7_avg * 1.8:
            anomaly = {
                "type": "spike",
                "severity": "danger",
                "message": (
                    f"Unusual spending spike detected. "
                    f"Recent spending is {round(last_3_avg / prev_7_avg, 1)}× higher than normal."
                )
            }

    # ---------- 📈 FORECASTING (NEXT MONTH PREDICTION) ----------
    monthly_totals = defaultdict(float)

    for e in data.expenses:
        month_key = e.date.strftime("%Y-%m")
        monthly_totals[month_key] += e.amount

    sorted_months = sorted(monthly_totals.keys())

    forecast = None
    if len(sorted_months) >= 2:
        last_month = monthly_totals[sorted_months[-1]]
        prev_month = monthly_totals[sorted_months[-2]]

        growth_rate = (last_month - prev_month) / prev_month if prev_month > 0 else 0
        predicted_next_month = round(last_month * (1 + growth_rate))

        forecast = {
            "nextMonthEstimate": predicted_next_month,
            "trend": "up" if growth_rate > 0 else "down",
            "message": (
                f"If you continue this trend, you may spend around "
                f"₹{predicted_next_month} next month."
            )
        }

        recommendations.append({
            "icon": "🔮",
            "title": "Next Month Forecast",
            "text": forecast["message"]
        })

    # ---------- FINAL RESPONSE ----------
    response = {
        "title": f"{top_category} is your top expense",
        "message": (
            f"{top_category} accounts for {percentage}% of your spending.\n\n"
            f"You spent ₹{top_amount} on this category."
        ),
        "percentage": percentage,
        "severity": (
            "danger" if percentage >= 60
            else "warning" if percentage >= 40
            else "good"
        ),
        "savingTip": (
            f"If you reduce {top_category.lower()} spending by ₹{suggested_saving}, "
            f"you could save more this month."
        ),
        "weeklyTrend": weekly_trend,
        "autoBudget": {
            "category": top_category,
            "suggested": recommended_budget,
            "reason": "Based on your recent spending pattern"
        },
        "recommendations": recommendations,
        "popup": popup
    }

    if anomaly:
        response["anomaly"] = anomaly

    if forecast:
        response["forecast"] = forecast

    return response
