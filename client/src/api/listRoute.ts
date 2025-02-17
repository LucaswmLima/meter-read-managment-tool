import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const listRoute = async (customerCode: string) => {  
  const url = `${BASE_URL}/${customerCode}/list/`; // Adicionando a barra entre BASE_URL e o customerCode
  console.log("Request URL:", url); // Log para ver a URL gerada
  const response = await axios.get(url, {}); // Usando a URL corrigida

  return response;
};

export default listRoute;
