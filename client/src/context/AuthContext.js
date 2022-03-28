import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INIT_STATE = {
  user: {
    _id: "623adde74ef5586dee2a1a7e",
    username: "test1",
    email: "test1@gmail.com",
    password: "$2b$10$jKUYZodOZZojGjIXPS4yo.W18En8t/f60WvG0PrZ113rlsIMN6ZxK",
    profilePicture: "",
    coverPicture: "",
    followers: [],
    followings: [],
    isAdmin: false,
    createdAt: "2022-03-23T08:44:23.779+00:00",
    updatedAt: "2022-03-23T09:37:01.116+00:00",
  },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INIT_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INIT_STATE);

  return (
    <AuthContext.Provider value={{ user: state.user, isFetching: state.isFetching, error: state.error, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
