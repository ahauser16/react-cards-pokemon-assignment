import { useState } from "react";
import axios from "axios";


export function useFlip() {
  const [isFacingUp, setIsFacingUp] = useState(true);
  const flip = () => {
    setIsFacingUp(isUp => !isUp);
  };
  return [isFacingUp, flip];
}

export function useAxios(baseUrl) {
    const [data, setData] = useState([]);
  
    const addData = async (endpoint = "") => {
      const response = await axios.get(`${baseUrl}${endpoint}`);
      setData(data => [...data, response.data]);
    };
  
    return [data, addData];
  }