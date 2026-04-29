import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      display: "flex",
      gap: "20px",
      padding: "10px",
      background: "#eee",
      marginBottom: "20px"
    }}>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/goals">Goals</Link>
    </div>
  );
}

export default Navbar;