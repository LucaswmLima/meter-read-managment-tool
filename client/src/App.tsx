import { useState } from "react";
import axios from "axios";
import { generateDatetime } from "./utils/utils";
import { Measurement } from "./interfaces/measureInterface";
import {
  validateAddFields,
  validateConfirmFields,
  validateListFields,
} from "./validations/measureValidation";

const App = () => {
  const [customerCode, setCustomerCode] = useState("");
  const [measureType, setMeasureType] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentMeasure, setCurrentMeasure] = useState<Measurement>({
    image_url: "",
    measure_value: "",
    measure_uuid: "",
    confirmation_status: null,
  });

  const [confirmValue, setConfirmValue] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageBase64(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMeasurement = async () => {
    //Valida os dados de entrada
    validateAddFields(customerCode, measureType, imageBase64);

    // Chamada ADD
    try {
      const addResponse = await axios.post(`http://localhost:3000/add`, {
        image: imageBase64,
        customer_code: customerCode,
        measure_datetime: generateDatetime(),
        measure_type: measureType,
      });

      const { image_url, measure_value, measure_uuid } = addResponse.data;

      setCurrentMeasure({
        image_url,
        measure_value,
        measure_uuid,
        confirmation_status: null,
      });
      // Coloca o placeholder do que foi medido para confirmar
      setConfirmValue(measure_value);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Verifica se o erro é do Axios
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message;

        // Log de erro conhecido
        console.error(
          `Erro: ${statusCode} - ${errorMessage || "Algo deu errado."}`
        );

        // Alerta de erro conhecido
        alert(`Erro ao adicionar a medição. ${statusCode} ${errorMessage}`);
      } else {
        // Log e alerta de erro inesperado
        console.error("Erro inesperado:", error);
        alert("Erro inesperado ao adicionar a medição.");
      }
    }
  };

  const handleConfirmMeasurement = async () => {
    //Valida os dados de entrada
    validateConfirmFields(currentMeasure.measure_uuid, confirmValue);

    // chamada CONFIRM
    try {
      const confirmResponse = await axios.patch(
        "http://localhost:3000/confirm/",
        {
          measure_uuid: currentMeasure.measure_uuid,
          confirmed_value: confirmValue,
        }
      );

      const { success } = confirmResponse.data;

      if (success) {
        alert("Measurement confirmed successfully.");
      } else {
        alert("Measurement confirmation failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Verifica se o erro é do Axios
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message;

        // Log de erro conhecido
        console.error(
          `Erro: ${statusCode} - ${errorMessage || "Algo deu errado."}`
        );

        // Alerta de erro conhecido
        alert(`Erro ao confirmar a medição. ${statusCode} ${errorMessage}`);
      } else {
        // Log e alerta de erro inesperado
        console.error("Erro inesperado:", error);
        alert("Erro inesperado ao adicionar a medição.");
      }
    }
  };

  const handleListMeasurements = async () => {
    //Valida os dados de entrada
    validateListFields(customerCode)

    //chamada LIST
    try {
      const listResponse = await axios.get(
        `http://localhost:3000/${customerCode}/list`
      );
      setMeasurements(listResponse.data.measures);
    } catch (error) {
      console.error(error);
      alert("Error fetching measurements.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Measurement Management</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Customer Code"
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="text"
          placeholder="Measure Type"
          value={measureType}
          onChange={(e) => setMeasureType(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleAddMeasurement} style={{ padding: "5px 10px" }}>
          Add Measurement
        </button>
      </div>

      {currentMeasure && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Current Measurement</h3>
          <img
            src={`http://localhost:3000${currentMeasure.image_url}`}
            alt="Uploaded file"
          />
          <p>Measure Value: {currentMeasure.measure_value}</p>
          <p>Measure UUID: {currentMeasure.measure_uuid}</p>

          {!currentMeasure.confirmation_status && (
            <div>
              <input
                type="text"
                placeholder={`Current: ${currentMeasure.measure_value}`}
                value={confirmValue}
                onChange={(e) => setConfirmValue(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
              />
              <button
                onClick={handleConfirmMeasurement}
                style={{ padding: "5px 10px" }}
              >
                Confirm Measurement
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleListMeasurements}
          style={{ padding: "5px 10px" }}
        >
          List Measurements
        </button>
      </div>

      <div>
        <h3>Measurements</h3>
        {measurements.length > 0 ? (
          <ul>
            {measurements.map((measurement, index) => (
              <li key={index}>
                <img
                  src={`http://localhost:3000${measurement.image_url}`}
                  alt="Uploaded file"
                />
                <p>Measure Value: {measurement.measure_value}</p>
                <p>Measure UUID: {measurement.measure_uuid}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No measurements found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
