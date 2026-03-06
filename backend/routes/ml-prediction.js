// backend/routes/ml-prediction.js
const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense"); // your existing Expense model

// Simple "next month" prediction using average monthly expense
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find(); // get all expenses

    if (expenses.length === 0) {
      return res.json({ predicted_expense: 0 });
    }

    // Calculate average expense
    const total = expenses.reduce((acc, item) => acc + item.amount, 0);
    const monthsTracked = 1; // simple demo (1 month) or use createdAt date to calculate months
    const avgMonthly = total / monthsTracked;

    // Add small growth factor (e.g., +5% prediction)
    const predicted_expense = Math.round(avgMonthly * 1.05);

    res.json({ predicted_expense });
  } catch (err) {
    console.error("ML Prediction Error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;