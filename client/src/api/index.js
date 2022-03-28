import axios from "axios";
import { apiUrl } from "../shared";

export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(`${apiUrl}auth/login`, userCredentials);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
