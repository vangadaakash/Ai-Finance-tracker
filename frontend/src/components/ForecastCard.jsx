function ForecastCard({ forecast }) {
  if (!forecast) return null;

  return (
    <div className="forecast-card">
      <h3>🔮 Next Month Forecast</h3>

      <div className="forecast-amount">
        ₹{forecast.nextMonthAmount.toLocaleString()}
      </div>

      <p>
        Likely highest spending on <b>{forecast.topCategory}</b>
      </p>

      <small>
        Confidence level: <b>{forecast.confidence}</b>
      </small>
    </div>
  );
}

export default ForecastCard;
