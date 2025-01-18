import { useState, useEffect } from "react";
import axios from "axios";
import "./listMeasurements.css";

const ListMeasurements = () => {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await axios.get("http://localhost:3000/measurements");
        setMeasurements(response.data.measures);
      } catch (error) {
        console.error("Error fetching measurements:", error);
      }
    };
    fetchMeasurements();
  }, []);

  return (
    <div className="list-measurements">
      <h2>Measurements List</h2>
      {measurements.length > 0 ? (
        <ul>
          {measurements.map((measure, index) => (
            <li key={index}>
              <img src={measure.image_url} alt="Measurement" />
              <p>Value: {measure.measure_value}</p>
              <p>UUID: {measure.measure_uuid}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No measurements available.</p>
      )}
    </div>
  );
};

export default ListMeasurements;
