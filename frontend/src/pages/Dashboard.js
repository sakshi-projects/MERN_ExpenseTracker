// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// function Dashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const [expenses, setExpenses] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [salary, setSalary] = useState("");
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [editId, setEditId] = useState(null);

//   const [showGoalForm, setShowGoalForm] = useState(false);
//   const [goalTitle, setGoalTitle] = useState("");
// const [goalAmount, setGoalAmount] = useState("");
// const [goalMonths, setGoalMonths] = useState("");
// const [goalPrediction, setGoalPrediction] = useState(null);
//   const [summary, setSummary] = useState({
//     salary: 0,
//     totalExpense: 0,
//     remaining: 0,
//   });

//   useEffect(() => {
//     const sum = expenses.reduce((acc, item) => {
//       return acc + Number(item.amount);
//     }, 0);

//     setTotal(sum);
//   }, [expenses]);
//   const remaining = salary - total;

  

//   const categoryData = Object.values(
//     expenses.reduce((acc, item) => {
//       const category = item.category || "Other";

//       if (!acc[category]) {
//         acc[category] = { name: category, value: 0 };
//       }

//       acc[category].value += Number(item.amount);

//       return acc;
//     }, {}),
//   );

//   // Fetch Expenses
//   const fetchExpenses = async () => {
//     try {
//       const res = await API.get("/expenses");
//       const updatedExpenses = res.data.map((item) => ({
//         ...item,
//         category: detectCategory(item.title),
//       }));

//       setExpenses(updatedExpenses);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchSummary = async () => {
//     try {
//       const res = await API.get("/dashboard-summary");
//       setSummary(res.data);
//     } catch (err) {
//       console.log("Summary error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//     fetchSummary();
//   }, []);

  
//   const handleAddExpense = async () => {
//     console.log("Edit ID:", editId);
//     if (!title || !amount) return;

//     try {
//       if (editId !== null) {
//         // UPDATE
//         await API.put(`/expenses/${editId}`, {
//           title,
//           amount: Number(amount),
//         });

//         setEditId(null);
//       } else {
//         // ADD
//         await API.post("/expenses", {
//           title,
//           amount: Number(amount),
//         });
//       }

//       setTitle("");
//       setAmount("");
//       fetchExpenses();
//       fetchSummary();
//     } catch (err) {
//       console.log(err);
//     }
//   };



//   // Delete Expense
//   const handleDelete = async (id) => {
//     try {
//       // await API.delete(`/expenses/${id}`, {
//       //   headers: { Authorization: token },
//       // });
//       await API.delete(`/expenses/${id}`);
//       fetchExpenses();
//       fetchSummary();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const totalExpense = expenses.reduce(
//     (total, item) => total + Number(item.amount),
//     0,
//   );

//   const detectCategory = (title) => {
//     const text = title.toLowerCase();

//     if (
//       ["pizza", "burger", "food", "swiggy", "zomato", "restaurant"].some(
//         (word) => text.includes(word),
//       )
//     ) {
//       return "Food 🍔";
//     }

//     if (
//       ["rapido", "uber", "ola", "bus", "train", "petrol", "fuel"].some((word) =>
//         text.includes(word),
//       )
//     ) {
//       return "Transport 🚗";
//     }

//     if (
//       ["amazon", "flipkart", "shopping", "clothes"].some((word) =>
//         text.includes(word),
//       )
//     ) {
//       return "Shopping 🛍";
//     }

//     if (["movie", "netflix", "game"].some((word) => text.includes(word))) {
//       return "Entertainment 🎬";
//     }

//     return "Other 📦";
//   };

//   const COLORS = ["#8b5cf6", "#ec4899", "#22c55e", "#f59e0b", "#3b82f6"];

//   const handleSetGoal = async () => {

//   if (!goalTitle || !goalAmount || !goalMonths) return;

//   try {

//     const res = await API.post(
//       "/set-goal",
//       {
//         title: goalTitle,
//         amount: Number(goalAmount),
//         months: Number(goalMonths)
//       },
//       { headers: { Authorization: token } }
//     );

//     setGoalPrediction(res.data);

//   } catch (err) {
//     console.log(err);
//   }
// };

//   return (
//     <div className="dashboard-container">
//       <h2>Expense Dashboard 💜</h2>

//       {/* Add Expense Form */}
//       <form
//         className="expense-form"
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleAddExpense();
//         }}
//       >
//         <input
//           type="number"
//           placeholder="Enter Salary"
//           value={salary}
//           onChange={(e) => setSalary(Number(e.target.value))}
//           // required
//           // className="salary-input"
//         />

//         <input
//           type="text"
//           placeholder="Expense Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <input
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />

//         <button type="submit">
//           {editId ? "Update Expense" : "Add Expense"}
//         </button>
//       </form>

//       {/* Total */}
//       <div className="summary-card">
//         <h3>Total Expense: ₹{totalExpense}</h3>
//       </div>

//       {/* Goal Setting */}

//       {/* Goal Setting */}
// <form
//   className="expense-form"
//   onSubmit={(e) => {
//     e.preventDefault();
//     handleSetGoal();
//   }}
// >
//   <input
//     type="text"
//     placeholder="Goal (Example: Buy Laptop)"
//     value={goalTitle}
//     onChange={(e) => setGoalTitle(e.target.value)}
//   />

//   <input
//     type="number"
//     placeholder="Goal Amount"
//     value={goalAmount}
//     onChange={(e) => setGoalAmount(e.target.value)}
//   />

//   <input
//     type="number"
//     placeholder="Months"
//     value={goalMonths}
//     onChange={(e) => setGoalMonths(e.target.value)}
//   />

//   <button type="submit">Set Goal 🎯</button>
// </form>

// {goalPrediction && (
//   <div className="summary-card">
//     <h3>Goal Analysis 🎯</h3>

//     <p>Goal: {goalPrediction.goal}</p>
//     <p>Monthly Saving Needed: ₹{goalPrediction.monthlySaving}</p>
//     <p>Remaining After Expenses: ₹{goalPrediction.remaining}</p>
//   </div>
// )}

//       <div className="financial-summary">
//         <div className="card salary">
//           <h4>Salary</h4>
//           <p>₹{salary}</p>
//         </div>

//         <div className="card expense">
//           <h4>Total Expense</h4>
//           <p>₹{totalExpense}</p>
//         </div>

//         <div className="card remaining">
//           <h4>Remaining </h4>
//           <p>₹ {remaining}</p>
//         </div>
//       </div>

//         {remaining < 0 && (
//   <div className="warning-box">
//     ⚠ You are overspending! Expenses exceeded salary.
//   </div>
// )}



//       <div
//         style={{
//           marginTop: "40px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <h3>Expense by Category</h3>

//         <PieChart width={400} height={300}>
//           <Pie
//             data={categoryData}
//             dataKey="value"
//             nameKey="name"
//             outerRadius={100}
//             label
//           >
//             {categoryData.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </div>

      

//       {/* Expense List */}
//       <div className="expense-list">
//         {expenses.map((item) => (
//           <div className="expense-card" key={item._id}>
//             <div className="expense-left">
//               <h4>{item.title}</h4>
//               <p className="category">{item.category}</p>
//             </div>

//             <div className="expense-right">₹{item.amount}</div>
//             <button
//               className="edit-btn"
//               onClick={() => {
//                 setTitle(item.title);
//                 setAmount(item.amount);
//                 setEditId(item._id);
//               }}
//             >
//               Edit
//             </button>
//             <button
//               className="delete-btn"
//               onClick={() => handleDelete(item._id)}
//             >
//               🗑
//             </button>
//           </div>
//         ))}
//       </div>

//       <button className="logout-btn" onClick={handleLogout}>
//         Logout
//       </button>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [salary, setSalary] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [editId, setEditId] = useState(null);

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
const [goalAmount, setGoalAmount] = useState("");
const [goalMonths, setGoalMonths] = useState("");
const [goalPrediction, setGoalPrediction] = useState(null);
const [prediction, setPrediction] = useState(null);
const [overspendCategory, setOverspendCategory] = useState(null); // new
  const [summary, setSummary] = useState({
    salary: 0,
    totalExpense: 0,
    remaining: 0,
  });

  useEffect(() => {
    const sum = expenses.reduce((acc, item) => {
      return acc + Number(item.amount);
    }, 0);

    setTotal(sum);
  }, [expenses]);
  const remaining = salary - total;

  

  const categoryData = Object.values(
    expenses.reduce((acc, item) => {
      const category = item.category || "Other";

      if (!acc[category]) {
        acc[category] = { name: category, value: 0 };
      }

      acc[category].value += Number(item.amount);

      return acc;
    }, {}),
  );

  // Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      const updatedExpenses = res.data.map((item) => ({
        ...item,
        category: detectCategory(item.title),
      }));

      setExpenses(updatedExpenses);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await API.get("/dashboard-summary");
      setSummary(res.data);
    } catch (err) {
      console.log("Summary error:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    fetchPrediction();
  }, [expenses]);

  const fetchPrediction = async () => {
  try {
    const res = await API.get("/ml-prediction");  // Backend ML endpoint
    setPrediction(res.data.predicted_expense);

    // Optional: Calculate which category overspent
    const categoryTotals = expenses.reduce((acc, item) => {
      const cat = item.category || "Other";
      acc[cat] = (acc[cat] || 0) + Number(item.amount);
      return acc;
    }, {});

    // Find highest category expense
    let maxCat = null;
    let maxAmount = 0;
    for (let cat in categoryTotals) {
      if (categoryTotals[cat] > maxAmount) {
        maxAmount = categoryTotals[cat];
        maxCat = cat;
      }
    }

    setOverspendCategory(maxCat);

  } catch (err) {
    console.log("ML Prediction error:", err);
  }
};

  const handleAddExpense = async () => {
    console.log("Edit ID:", editId);
    if (!title || !amount) return;

    try {
      if (editId !== null) {
        // UPDATE
        await API.put(`/expenses/${editId}`, {
          title,
          amount: Number(amount),
        });

        setEditId(null);
      } else {
        // ADD
        await API.post("/expenses", {
          title,
          amount: Number(amount),
        });
      }

      setTitle("");
      setAmount("");
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      console.log(err);
    }
  };



  // Delete Expense
  const handleDelete = async (id) => {
    try {
      // await API.delete(`/expenses/${id}`, {
      //   headers: { Authorization: token },
      // });
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalExpense = expenses.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  const detectCategory = (title) => {
    const text = title.toLowerCase();

    if (
      ["pizza", "burger", "food", "swiggy", "zomato", "restaurant"].some(
        (word) => text.includes(word),
      )
    ) {
      return "Food 🍔";
    }

    if (
      ["rapido", "uber", "ola", "bus", "train", "petrol", "fuel"].some((word) =>
        text.includes(word),
      )
    ) {
      return "Transport 🚗";
    }

    if (
      ["amazon", "flipkart", "shopping", "clothes"].some((word) =>
        text.includes(word),
      )
    ) {
      return "Shopping 🛍";
    }

    if (["movie", "netflix", "game"].some((word) => text.includes(word))) {
      return "Entertainment 🎬";
    }

    return "Other 📦";
  };

  const COLORS = ["#8b5cf6", "#ec4899", "#22c55e", "#f59e0b", "#3b82f6"];

  const handleSetGoal = async () => {

  if (!goalTitle || !goalAmount || !goalMonths) return;

  try {

    const res = await API.post(
      "/set-goal",
      {
        title: goalTitle,
        amount: Number(goalAmount),
        months: Number(goalMonths)
      },
      { headers: { Authorization: token } }
    );

    setGoalPrediction(res.data);

  } catch (err) {
    console.log(err);
  }
};



  return (
    <div className="dashboard-container">
      <h2>Expense Dashboard 💜</h2>

      {/* Add Expense Form */}
      <form
        className="expense-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddExpense();
        }}
      >
        <input
          type="number"
          placeholder="Enter Salary"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          // required
          // className="salary-input"
        />

        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button type="submit">
          {editId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      {/* Total */}
      <div className="summary-card">
        <h3>Total Expense: ₹{totalExpense}</h3>
      </div>

      {/* Goal Setting */}

      {/* Goal Setting */}
<form
  className="expense-form"
  onSubmit={(e) => {
    e.preventDefault();
    handleSetGoal();
  }}
>
  <input
    type="text"
    placeholder="Goal (Example: Buy Laptop)"
    value={goalTitle}
    onChange={(e) => setGoalTitle(e.target.value)}
  />

  <input
    type="number"
    placeholder="Goal Amount"
    value={goalAmount}
    onChange={(e) => setGoalAmount(e.target.value)}
  />

  <input
    type="number"
    placeholder="Months"
    value={goalMonths}
    onChange={(e) => setGoalMonths(e.target.value)}
  />

  <button type="submit">Set Goal 🎯</button>
</form>

{goalPrediction && (
  <div className="summary-card">
    <h3>Goal Analysis 🎯</h3>

    <p>Goal: {goalPrediction.goal}</p>
    <p>Monthly Saving Needed: ₹{goalPrediction.monthlySaving}</p>
    <p>Remaining After Expenses: ₹{goalPrediction.remaining}</p>
  </div>
)}

      <div className="financial-summary">
        <div className="card salary">
          <h4>Salary</h4>
          <p>₹{salary}</p>
        </div>

        <div className="card expense">
          <h4>Total Expense</h4>
          <p>₹{totalExpense}</p>
        </div>

        <div className="card remaining">
          <h4>Remaining </h4>
          <p>₹{remaining}</p>
        </div>
      </div>

        {remaining < 0 && (
  <div className="warning-box">
    ⚠ You are overspending! Expenses exceeded salary.
  </div>
)}

  {prediction && (
  <div className="summary-card">
    <h3>AI Expense Prediction 🤖</h3>
    <p>Next Month Expense: ₹{prediction}</p>
    {overspendCategory && (
      <p>
        ⚠ You are likely overspending in: <strong>{overspendCategory}</strong>
      </p>
    )}
  </div>
)}

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Expense by Category</h3>

        <PieChart width={400} height={300}>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      

      {/* Expense List */}
      <div className="expense-list">
        {expenses.map((item) => (
          <div className="expense-card" key={item._id}>
            <div className="expense-left">
              <h4>{item.title}</h4>
              <p className="category">{item.category}</p>
            </div>

            <div className="expense-right">₹{item.amount}</div>
            <button
              className="edit-btn"
              onClick={() => {
                setTitle(item.title);
                setAmount(item.amount);
                setEditId(item._id);
              }}
            >
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(item._id)}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;

