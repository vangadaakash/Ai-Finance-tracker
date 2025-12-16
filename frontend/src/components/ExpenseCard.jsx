function ExpenseCard({ category, description, amount }) {
  return (
    <div className="card">
      <h4>{category}</h4>
      <p>{description}</p>
      <b>₹{amount}</b>
    </div>
  );
}

export default ExpenseCard;
