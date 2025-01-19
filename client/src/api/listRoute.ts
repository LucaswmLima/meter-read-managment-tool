import axios from "axios";

const BASE_URL = "http://localhost:3000";

const addRoute = async (customerCode: string) => {
  const response = await axios.get(
    `${BASE_URL}${customerCode}/list/`,
    {}
  );

  return response;
};

export default addRoute