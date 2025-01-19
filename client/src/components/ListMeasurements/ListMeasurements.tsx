import { useState } from "react";
import axios from "axios";
import "./listMeasurements.css";
import { Measurement } from "../../interfaces/measureInterface";

const ListMeasurements = () => {
  const [customerCode, setCustomerCode] = useState("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!customerCode) {
      setErrorMessage("Customer code is required.");
      setMeasurements([]);
      return;
    }
  
    try {
      const response = await axios.get<{ measures: Measurement[] }>(
        `http://localhost:3000/${customerCode}/list/`
      );
      setMeasurements(response.data.measures || []);
      setErrorMessage(""); // Limpa a mensagem de erro em caso de sucesso
    } catch (error) {
      // Verifique se o erro é do tipo axios
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        
        // Verifique se os dados de erro estão disponíveis
        if (errorData && errorData.error_code) {
          // A API retornou um erro, então defina a mensagem de erro com base na resposta da API
          console.log('Error Code:', errorData.error_code);
          console.log('Error Description:', errorData.error_description);
          setErrorMessage(errorData.error_description || 'Erro desconhecido');
        } else {
          // Erro Axios caso não tenha um erro especifico
          setErrorMessage("Failed to fetch measurements. Please try again.");
        }
      } else {
        // Erro generico
        setErrorMessage("An unexpected error occurred.");
      }
  
      setMeasurements([]); // Limpa as medições em caso de erro
    }
  };
  

  return (
    <div className="list-measurements">
      <h2>Measurements List</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Customer Code"
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {measurements.length > 0 ? (
        <ul>
          {measurements.map((measure) => (
            <li key={measure.measure_uuid}>
              <img
                src={`http://localhost:3000${measure.image_url}`}
                alt="Measurement"
                onError={(e) => {
                  const sibling = e.currentTarget
                    .nextElementSibling as HTMLElement;
                  e.currentTarget.style.display = "none"; // Oculta a imagem
                  sibling.style.display = "block"; // Mostra o texto
                }}
              />
              <p style={{ display: "none", color: "red" }}>
                Imagem não disponível
              </p>
              <p>Value: {measure.measure_value}</p>
              <p>UUID: {measure.measure_uuid}</p>
              <p>
                Confirmation Status: {measure.confirmation_status || "Pending"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        !errorMessage && <p>No measurements available.</p>
      )}
    </div>
  );
};

export default ListMeasurements;
