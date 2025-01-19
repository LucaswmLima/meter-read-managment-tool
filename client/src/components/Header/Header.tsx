import React from "react";
import "./header.css";

interface HeaderProps {
  setView: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  return (
    <header className="header">
      <h1>Measurement Manager</h1>
      <nav className="nav">
        <button onClick={() => setView("add")} className="nav-button">Add Measurement</button>
        <button onClick={() => setView("list")} className="nav-button">List Measurements</button>
      </nav>
    </header>
  );
};

export default Header;
