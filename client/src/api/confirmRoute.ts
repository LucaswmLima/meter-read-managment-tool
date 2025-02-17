import axios from "axios";

const BASE_URL = import.meta.env.API_URL || "http://localhost:3000";

const confirmRoute = async (uuid: string, confirmedValue: number) => {
  const response = await axios.patch(`${BASE_URL}/confirm/`, {
    measure_uuid: uuid,
    confirmed_value: confirmedValue,
  });

  return response
};

export default confirmRoute;
