import React from "react";

const Store = React.createContext();
Store.displayName = "Store";
export const authData = JSON.parse(localStorage.getItem("user"));

export const initialState = {
  user: authData || {},
  isLoading: false,
  scammerId: "",
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state, user: action.payload };
    case "SCAMMER_ID":
      return { ...state, scammerId: action.payload };
    default:
      return state;
  }
};

export const useAuthStore = () => React.useContext(Store);
export const Provider = ({ children, initialState, reducer }) => {
  const [globalState, dispatch] = React.useReducer(reducer, initialState);
  return (
    <Store.Provider value={[globalState, dispatch]}>{children}</Store.Provider>
  );
};
