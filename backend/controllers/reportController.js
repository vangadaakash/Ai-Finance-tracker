const PDFDocument = require("pdfkit");
const Expense = require("../models/Expense");

const exportReport = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.userId;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // 🔹 Fetch expenses for selected month
    const expenses = await Expense.find({
      user: userId,
      date: {
        $gte: new Date(`${month}-01`),
        $lt: new Date(`${month}-31`)
      }
    });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Expense_Report_${month}.pdf`
    );

    doc.pipe(res);

    /* ================= TITLE ================= */
    doc.fontSize(20).text("Expense Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Month: ${month}`);
    doc.moveDown();

    /* ================= EXPENSE LIST ================= */
    let totalSpent = 0;
    const categoryTotals = {};

    expenses.forEach((e, i) => {
      totalSpent += Number(e.amount || 0);

      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + Number(e.amount || 0);

      doc.fontSize(11).text(
        `${i + 1}. ${e.category} - ₹${e.amount} (${new Date(
          e.date
        ).toDateString()})`
      );
    });

    /* ================= TOTAL ================= */
    doc.moveDown();
    doc.fontSize(14).text(`Total Spent: ₹${totalSpent}`, {
      align: "right"
    });

    /* ================= AI SUMMARY ================= */
    doc.moveDown(2);
    doc.fontSize(14).text("AI Spending Summary");

    let aiSummaryText = "Your spending looks balanced this month.";

    if (expenses.length > 0 && totalSpent > 0) {
      const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
        categoryTotals[a] > categoryTotals[b] ? a : b
      );

      const topAmount = categoryTotals[topCategory];
      const percentage = Math.round((topAmount / totalSpent) * 100);
      const suggestedSaving = Math.round(topAmount * 0.15);

      aiSummaryText =
        `Your highest spending was on ${topCategory}, ` +
        `which accounted for ${percentage}% of your total expenses. ` +
        `Reducing ${topCategory.toLowerCase()} spending by ₹${suggestedSaving} ` +
        `could help you save more next month.`;
    }

    doc
      .moveDown(0.5)
      .fontSize(11)
      .text(aiSummaryText, {
        width: 500,
        align: "left"
      });

    /* ================= END PDF ================= */
    doc.end();
  } catch (err) {
    console.error("PDF error:", err);
    res.status(500).json({ message: "Failed to export report" });
  }
};

module.exports = { exportReport };
