import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/footer";
import "./App.css";
import AddMeasurement from "./components/AddMeasurement/addMeasurement";
import ListMeasurements from "./components/ListMeasurements/listMeasurements";

const App = () => {
  const [view, setView] = React.useState("add");

  return (
    <div className="app-container">
      <Header setView={setView} />

      <main className="main-content">
        {view === "add" && <AddMeasurement />}
        {view === "list" && <ListMeasurements />}
      </main>

      <Footer />
    </div>
  );
};

export default App;
