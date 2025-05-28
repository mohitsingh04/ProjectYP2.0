// DataRequest.js
import { useEffect, useState } from "react";
import API from "../API/API";

export default function GetToken() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await API.get("/profile/token");
        setToken(response.data.token);
      } catch (error) {
        console.error(error);
      }
    };

    getToken();
  }, []);
  return token;
}
