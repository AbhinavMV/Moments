import { createContext, useReducer, useContext } from "react";

const UserDetailsStateContext = createContext();
const UserDetailsDispatchContext = createContext();

const userDetailsReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_DETAILS":
      return {
        ...state,
        userDetails: action.payload,
      };
    case "SELECT_USER":
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          friends: state.userDetails.friends.map((friend) => ({
            ...friend,
            selected: friend.id === action.payload,
          })),
        },
      };
    case "SET_USER_MESSAGE":
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          currMessages: action.payload,
        },
      };
    case "ADD_MESSAGE":
      const messagesCopy = [...state.userDetails.currMessages, action.payload];
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          currMessages: messagesCopy,
        },
      };
    default:
      throw new Error("Unknow action type:", action.type);
  }
};
export const UserDetailsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userDetailsReducer, { userDetails: null });
  return (
    <UserDetailsDispatchContext.Provider value={dispatch}>
      <UserDetailsStateContext.Provider value={state}>{children}</UserDetailsStateContext.Provider>
    </UserDetailsDispatchContext.Provider>
  );
};

export const useUserDetailsState = () => useContext(UserDetailsStateContext);
export const useUserDetailsDispatch = () => useContext(UserDetailsDispatchContext);
