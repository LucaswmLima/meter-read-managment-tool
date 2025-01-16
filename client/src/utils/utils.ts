// Gera a data e gora atual do cliente e converte para o formato ISO 8601 para poder ser usado
const generateDatetime = () => {
  const now = new Date();
  const isoString = now.toISOString();
  return isoString;
};

export { generateDatetime };
