import axios from "axios";

const BASE_URL = import.meta.env.API_URL || "http://localhost:3000";

const addRoute = async (customerCode: string) => {
  console.log(`${BASE_URL}${customerCode}/list/`);
  
  const response = await axios.get(
    `${BASE_URL}${customerCode}/list/`,
    {}
  );

  return response;
};

export default addRoute