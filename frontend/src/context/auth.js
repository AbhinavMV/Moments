import { createContext, useReducer, useContext } from "react";
import jwtDecode from "jwt-decode";
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

let user = null;
const temp = JSON.parse(localStorage.getItem("profile"));
if (temp) {
  const decodedToken = jwtDecode(temp.token);
  if (decodedToken.exp * 1000 < new Date().getTime()) {
    localStorage.clear();
  } else {
    user = decodedToken;
  }
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("profile", JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case "LOGOUT":
      localStorage.clear();
      return { ...state, user: null };
    default:
      throw new Error("Unknow action type:", action.type);
  }
};
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>{children}</AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
