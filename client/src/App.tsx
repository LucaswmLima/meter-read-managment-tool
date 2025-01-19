import React from "react";
import Header from "./components/Header/Header";
import "./App.css";
import AddMeasurement from "./components/AddMeasurement/AddMeasurement";
import ListMeasurements from "./components/ListMeasurements/ListMeasurements";
import Footer from "./components/Footer/Footer";


const App = () => {
  const [view, setView] = React.useState("add");

  return (
    <div className="app-container">
      <Header setView={setView} />

      <main className="main-content">
        {view === "add" && <AddMeasurement/>}
        {view === "list" && <ListMeasurements/>}
      </main>

      <Footer/>
    </div>
  );
};

export default App;
