import React from "react";
import "./block.css";

function block({ children }) {
  return (
    <div className="block">
      <h1>Block</h1>
      {children}
    </div>
  );
}

export default block;
