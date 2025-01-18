/* src/components/AddMeasurement/AddMeasurement.tsx */
import { useState } from "react";
import axios from "axios";
import "./addMeasurement.css";
import { Measurement } from "../../interfaces/measureInterface";
import { generateDatetime } from "../../utils/utils";
import {
  validateAddFields,
  validateConfirmFields,
} from "../../validations/measureValidation";

const AddMeasurement = () => {
  const [customerCode, setCustomerCode] = useState("");
  const [measureType, setMeasureType] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentReading, setCurrentReading] = useState<string>(""); // Leitura que será confirmada
  const [confirmationStatus, setConfirmationStatus] = useState<{
    [key: string]: boolean;
  }>({}); // Rastrea o status de confirmação por medição
  const [confirmedMessage, setConfirmedMessage] = useState(false); // Para controlar a mensagem de confirmação

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
    // Valida entrada
    const isValid = validateAddFields(customerCode, measureType, imageBase64);
    if (!isValid) return; // Interrompe se a validação falhar

    try {
      const response = await axios.post("http://localhost:3000/add", {
        customer_code: customerCode,
        measure_type: measureType,
        image: imageBase64,
        measure_datetime: generateDatetime(),
      });

      console.log("Response data:", response.data);
      setMeasurements([...measurements, response.data]); // Adiciona a nova medição na lista
      setCurrentReading(response.data.measure_value); // Define o valor da leitura inicial
      setImageBase64(""); // Limpa a imagem carregada após o envio
      setCustomerCode(""); // Limpa o código do cliente
      setMeasureType(""); // Limpa o tipo de medição
    } catch (error) {
      console.error("Error adding measurement:", error);
    }
  };

  const handleConfirmMeasurement = async (uuid: string) => {
    // Valida entrada
    const isValid = validateConfirmFields(uuid, currentReading);
    if (!isValid) return;

    try {
      // Verifica se currentReading é uma string numérica e converte para número
      const confirmedValue = currentReading
        ? parseInt(currentReading, 10)
        : NaN;

      if (isNaN(confirmedValue)) {
        console.error("Invalid confirmed value");
        return; // Evita enviar um valor inválido
      }

      console.log(uuid, confirmedValue);

      const response = await axios.patch(`http://localhost:3000/confirm/`, {
        measure_uuid: uuid,
        confirmed_value: confirmedValue, // Envia o valor como número
      });

      console.log("Confirmation response:", response.data);
      setConfirmationStatus((prevStatus) => ({
        ...prevStatus,
        [uuid]: true, // Marca como confirmado
      }));

      // Após confirmar, resetar os estados para nova medição
      setImageBase64("");
      setCustomerCode("");
      setMeasureType("");
      setCurrentReading("");

      // Remove a medição da lista após confirmação
      setMeasurements((prevMeasurements) =>
        prevMeasurements.filter(
          (measurement) => measurement.measure_uuid !== uuid
        )
      );

      // Exibe a mensagem de confirmação
      setConfirmedMessage(true);
      setTimeout(() => {
        setConfirmedMessage(false); // Oculta a mensagem após um tempo
      }, 3000); // A mensagem ficará visível por 3 segundos
    } catch (error) {
      console.error("Error confirming measurement:", error);
    }
  };

  // Verifica se todas as medições foram confirmadas
  const allMeasurementsConfirmed = measurements.every(
    (measurement) => confirmationStatus[measurement.measure_uuid]
  );

  return (
    <div className="add-measurement">
      <h2>Add Measurement</h2>
      <input
        type="text"
        placeholder="Customer Code"
        value={customerCode}
        onChange={(e) => setCustomerCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Measure Type"
        value={measureType}
        onChange={(e) => setMeasureType(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        key={imageBase64}
        onChange={handleImageUpload}
      />
      <button onClick={handleAddMeasurement}>Add</button>

      {!allMeasurementsConfirmed && measurements.length > 0 && (
        <div className="measurement-list">
          <h3>Confirm Measurements</h3>
          {measurements.map((measurement) => (
            <div key={measurement.measure_uuid} className="measurement-item">
              {confirmationStatus[measurement.measure_uuid] ? (
                <p style={{ color: "green" }}>Measurement Confirmed!</p>
              ) : (
                <>
                  <p>Measure Value: {measurement.measure_value}</p>
                  <p>Image URL: {measurement.image_url}</p>
                  <p>
                    Confirmation Status:{" "}
                    {confirmationStatus[measurement.measure_uuid]
                      ? "Confirmed"
                      : "Pending"}
                  </p>
                  <input
                    type="text"
                    placeholder={measurement.measure_value}
                    value={currentReading ?? measurement.measure_value}
                    onChange={(e) => setCurrentReading(e.target.value)}
                  />
                  <button
                    onClick={() =>
                      handleConfirmMeasurement(measurement.measure_uuid)
                    }
                  >
                    Confirm
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmedMessage && (
        <p style={{ color: "green", marginTop: "20px" }}>
          Measurement Confirmed!
        </p>
      )}
    </div>
  );
};

export default AddMeasurement;
