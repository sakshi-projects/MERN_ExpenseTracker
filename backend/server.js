require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");

const User = require("./models/User");
const Salary = require("./models/Salary");
const Expense = require("./models/Expense");
const Goal = require("./models/Goal");
const categorizeExpense = require("./utils/categorizeExpense");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= DB CONNECT ================= */

mongoose.connect("mongodb://127.0.0.1:27017/smart-expense-tracker")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Error ❌", err));

/* ================= TOKEN VERIFY ================= */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
}

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

/* ================= ADD EXPENSE ================= */

app.post("/expenses", verifyToken, async (req, res) => {
  try {
    const { title, amount } = req.body;

    const category = categorizeExpense(title);

    const expense = new Expense({
      title,
      amount,
      category,
      user: req.userId,
    });

    await expense.save();

    res.status(201).json(expense);

  } catch (err) {
    res.status(500).json({ message: "Error saving expense" });
  }
});

/* ================= UPDATE EXPENSE ================= */

app.put("/expenses/:id", verifyToken, async (req, res) => {
  try {
    const { title, amount } = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, amount },
      { new: true }
    );

    res.json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: "Error updating expense" });
  }
});

/* ================= GET EXPENSES ================= */

app.get("/expenses", verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ _id: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

/* ================= DELETE EXPENSE ================= */

app.delete("/expenses/:id", verifyToken, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense" });
  }
});

/* ================= SET SALARY ================= */

app.post("/salary", verifyToken, async (req, res) => {
  try {
    const { amount, month } = req.body;

    const salary = new Salary({
      amount,
      month,
      user: req.userId,
    });

    await salary.save();

    res.status(201).json(salary);

  } catch (err) {
    res.status(500).json({ message: "Error saving salary" });
  }
});

/* ================= DASHBOARD SUMMARY ================= */

app.get("/dashboard-summary", verifyToken, async (req, res) => {
  try {
    const salary = await Salary.findOne({ user: req.userId }).sort({ _id: -1 });
    const expenses = await Expense.find({ user: req.userId });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = salary ? salary.amount - totalExpense : 0;

    res.json({
      salary: salary ? salary.amount : 0,
      totalExpense,
      remaining,
    });

  } catch (err) {
    res.status(500).json({ message: "Error loading dashboard" });
  }
});


// app.post("/set-goal", verifyToken, async (req, res) => {

//   const { title, amount, months } = req.body;

//   const expenses = await Expense.find({ user: req.userId });
//   const salary = await Salary.findOne({ user: req.userId }).sort({ _id:-1 });

//   const totalExpense = expenses.reduce((sum,e)=>sum+e.amount,0);

//   const remaining = salary.amount - totalExpense;

//   const monthlySaving = amount / months;

//   const possible = remaining >= monthlySaving;

//   res.json({
//     goal:title,
//     monthlySaving: monthlySaving.toFixed(0),
//     remaining,
//     possible
//   });

// });
app.post("/set-goal", verifyToken, async (req, res) => {
  try {
    const { title, amount, months } = req.body;

    if (!title || !amount || !months) {
      return res.status(400).json({ message: "All fields required" });
    }

    const salary = await Salary.findOne({ user: req.userId }).sort({ _id: -1 });
    const expenses = await Expense.find({ user: req.userId });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const remaining = salary ? salary.amount - totalExpense : 0;

    const monthlySaving = Math.ceil(amount / months);

    res.json({
      goal: title,
      monthlySaving: monthlySaving,
      remaining: remaining
    });

  } catch (err) {
    console.error("Goal Error:", err);
    res.status(500).json({ message: "Goal calculation failed" });
  }
});

/* ================= EXPORT PDF ================= */

app.get("/export-report", verifyToken, async (req, res) => {
  try {
    const salary = await Salary.findOne({ user: req.userId }).sort({ _id: -1 });
    const expenses = await Expense.find({ user: req.userId });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Financial_Report.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Smart Expense Tracker Report", { align: "center" });
    doc.moveDown();

    doc.text(`Salary: ₹${salary ? salary.amount : 0}`);
    doc.text(`Total Expense: ₹${totalExpense}`);
    doc.text(`Remaining: ₹${salary ? salary.amount - totalExpense : 0}`);

    doc.moveDown();
    doc.text("Expenses:");

    expenses.forEach((e, i) => {
      doc.text(`${i + 1}. ${e.title} - ₹${e.amount}`);
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ message: "Error generating report" });
  }
});

const axios = require("axios");

app.get("/ml-prediction", verifyToken, async (req, res) => {

  try {

    const expenses = await Expense.find({ user: req.userId });

    const values = expenses.map(e => e.amount);

    const response = await axios.post("http://localhost:5000/predict-expense", {
      expenses: values
    });

    res.json(response.data);

  } catch (err) {
    console.log(err);
    res.status(500).json({message:"ML prediction error"});
  }

});

const mlPredictionRoute = require("./routes/ml-prediction");
app.use("/ml-prediction", mlPredictionRoute);

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});