import { useState } from "react";
import "./addMeasurement.css";
import { Measurement } from "../../interfaces/measureInterface";
import {
  validateAddFields,
  validateConfirmFields,
} from "../../validations/measureValidation";
import confirmRoute from "../../api/confirmRoute";
import addRoute from "../../api/addRoute";
import { parseMeasureInt } from "../../utils/utils";
import axios from "axios";

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
  const [errorMessage, setErrorMessage] = useState(""); // Para exibir mensagens de erro

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
      // Faz a call de addRoute para a API
      const response = await addRoute(customerCode, measureType, imageBase64);
      console.log("Response data:", response.data);

      if (response.data && response.data.valid === false) {
        setErrorMessage(response.data.error_description || "Erro desconhecido");
        return;
      }

      setMeasurements([...measurements, response.data]); // Adiciona a nova medição na lista
      setCurrentReading(response.data.measure_value); // Define o valor da leitura inicial
      setImageBase64(""); // Limpa a imagem carregada após o envio
      setCustomerCode(""); // Limpa o código do cliente
      setMeasureType(""); // Limpa o tipo de medição
      setErrorMessage(""); // Limpa a mensagem de erro em caso de sucesso
    } catch (error) {
      // Verifique se o erro é do tipo Axios
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        // Verifique se os dados de erro estão disponíveis
        if (errorData && errorData.error_code) {
          // A API retornou um erro, então defina a mensagem de erro com base na resposta da API
          console.log('Error Code:', errorData.error_code);
          console.log('Error Description:', errorData.error_description);
          setErrorMessage(errorData.error_description || 'Erro desconhecido');
        } else {
          // Erro Axios caso não tenha um erro específico
          setErrorMessage("Failed to confirm measurement. Please try again.");
        }
      } else {
        // Erro genérico
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };


  const handleConfirmMeasurement = async (uuid: string) => {
    // Valida entrada
    const isValid = validateConfirmFields(uuid, currentReading);
    if (!isValid) return;

    try {
      // Verifica se currentReading é uma string numérica e converte para número
      const confirmedValue = parseMeasureInt(currentReading);
      // Faz a call de confirm para a API
      const response = await confirmRoute(uuid, confirmedValue);
      console.log("Confirmation response:", response.data);

      setConfirmationStatus((prevStatus) => ({
        ...prevStatus,
        [uuid]: true, // Marca como confirmado
      }));

      // Após confirmar, reseta os estados para nova medição
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
      // Verifique se o erro é do tipo Axios
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        // Verifique se os dados de erro estão disponíveis
        if (errorData && errorData.error_code) {
          // A API retornou um erro, então defina a mensagem de erro com base na resposta da API
          console.log('Error Code:', errorData.error_code);
          console.log('Error Description:', errorData.error_description);
          setErrorMessage(errorData.error_description || 'Erro desconhecido');
        } else {
          // Erro Axios caso não tenha um erro específico
          setErrorMessage("Failed to confirm measurement. Please try again.");
        }
      } else {
        // Erro genérico
        setErrorMessage("An unexpected error occurred.");
      }
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

      {/* Exibindo a mensagem de erro */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

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
