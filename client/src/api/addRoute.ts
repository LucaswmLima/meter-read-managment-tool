import axios from "axios";
import { generateDatetime } from "../utils/utils";

const BASE_URL = "http://localhost:3000";

const addRoute = async (customerCode: string, measureType: string, imageBase64: string) => {
  const response = await axios.post(`${BASE_URL}/add/`, {
    customer_code: customerCode,
  measure_type: measureType,
  image: imageBase64,
  measure_datetime: generateDatetime(),
  });

  return response
};

export default addRoute;
