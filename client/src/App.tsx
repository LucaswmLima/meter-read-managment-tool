import { useState } from 'react';
import axios from 'axios';

// Definindo a interface para os dados de medição
interface Measurement {
  image_url: string;
  measure_value: string;
  measure_uuid: string;
  confirmation_status: string | null;
}

// Definindo a interface para os itens de medição na lista
interface MeasurementListItem {
  image_url: string;
  measure_value: string;
  measure_uuid: string;
}

const App = () => {
  const [customerCode, setCustomerCode] = useState('');
  const [measurements, setMeasurements] = useState<MeasurementListItem[]>([]); // Atualizando o tipo da lista de medições
  const [currentMeasure, setCurrentMeasure] = useState<Measurement>({
    image_url: '',
    measure_value: '',
    measure_uuid: '',
    confirmation_status: null,
  });
  const [measureData, setMeasureData] = useState('');
  const [confirmValue, setConfirmValue] = useState('');

  const handleAddMeasurement = async () => {
    if (!customerCode || !measureData) {
      alert('Customer code and measure data are required.');
      return;
    }

    try {
      const addResponse = await axios.post(`http://localhost:3000/${customerCode}/add`, {
        measureData,
      });

      const { image_url, measure_value, measure_uuid } = addResponse.data;

      setCurrentMeasure({
        image_url,
        measure_value,
        measure_uuid,
        confirmation_status: null,
      });
      setConfirmValue(measure_value); // Set placeholder value for confirmation
    } catch (error) {
      console.error(error);
      alert('Error adding measurement.');
    }
  };

  const handleConfirmMeasurement = async () => {
    if (!currentMeasure.measure_uuid || !confirmValue) {
      alert('Please provide a valid measure value to confirm.');
      return;
    }

    try {
      const confirmResponse = await axios.patch('http://localhost:3000/confirm/', {
        measureId: currentMeasure.measure_uuid,
        valueToConfirm: confirmValue,
      });

      alert('Measurement confirmed successfully.');
      setCurrentMeasure({
        ...currentMeasure,
        confirmation_status: confirmResponse.data,
      });
    } catch (error) {
      console.error(error);
      alert('Error confirming measurement.');
    }
  };

  const handleListMeasurements = async () => {
    if (!customerCode) {
      alert('Customer code is required to list measurements.');
      return;
    }

    try {
      const listResponse = await axios.get(`http://localhost:3000/${customerCode}/list`);
      setMeasurements(listResponse.data);
      console.log(listResponse.data);
      
    } catch (error) {
      console.error(error);
      alert('Error fetching measurements.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Measurement Management</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Customer Code"
          value={customerCode}
          onChange={(e) => setCustomerCode(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Measure Data"
          value={measureData}
          onChange={(e) => setMeasureData(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleAddMeasurement} style={{ padding: '5px 10px' }}>
          Add Measurement
        </button>
      </div>

      {currentMeasure && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Current Measurement</h3>
          <p>Image URL: {currentMeasure.image_url}</p>
          <p>Measure Value: {currentMeasure.measure_value}</p>
          <p>Measure UUID: {currentMeasure.measure_uuid}</p>

          {!currentMeasure.confirmation_status && (
            <div>
              <input
                type="text"
                placeholder={`Current: ${currentMeasure.measure_value}`}
                value={confirmValue}
                onChange={(e) => setConfirmValue(e.target.value)}
                style={{ marginRight: '10px', padding: '5px' }}
              />
              <button onClick={handleConfirmMeasurement} style={{ padding: '5px 10px' }}>
                Confirm Measurement
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleListMeasurements} style={{ padding: '5px 10px' }}>
          List Measurements
        </button>
      </div>

      <div>
        <h3>Measurements</h3>
        {measurements.length > 0 ? (
          <ul>
            {measurements.map((measurement, index) => (
              <li key={index}>
                <p>Image URL: {measurement.image_url}</p>
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
