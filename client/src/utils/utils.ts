// Gera a data e gora atual do cliente e converte para o formato ISO 8601 para poder ser usado
const generateDatetime = () => {
  const now = new Date();
  const isoString = now.toISOString();
  return isoString;
};

const parseMeasureInt = (currentReading: string) => {
  // Verifica se currentReading é uma string numérica e converte para número
  const confirmedValue = parseInt(currentReading, 10);

  
  return confirmedValue;
};

export { generateDatetime, parseMeasureInt };
