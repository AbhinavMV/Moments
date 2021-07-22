import { createContext, useReducer, useContext } from "react";

const UserDetailsStateContext = createContext();
const UserDetailsDispatchContext = createContext();

const userDetailsReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_DETAILS":
      return {
        ...state,
        userDetails: { ...action.payload },
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
          currMessages: null,
        },
      };
    case "CLEAR_SELECTION":
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          friends: state.userDetails.friends.map((friend) => ({
            ...friend,
            selected: false,
          })),
          currMessages: null,
        },
      };
    case "SET_FRIENDS_MESSAGES":
      const temp = [...action.payload.friends];
      temp.length > 0 &&
        temp.sort((a, b) => {
          return new Date(b.latestMessage[0]?.createdAt) - new Date(a.latestMessage[0]?.createdAt);
        });
      return {
        ...state,
        userDetails: { ...action.payload, friends: temp, selected: false },
      };
    case "SET_USER_MESSAGE":
      let reverseList = [...action.payload.results].reverse();
      if (state.userDetails.currMessages) {
        reverseList = [...reverseList, ...state.userDetails.currMessages];
      }
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          currMessages: reverseList,
        },
      };
    case "ADD_MESSAGE":
      const messagesCopy = [...state.userDetails.currMessages, action.payload];
      const friendsCopy = [...state.userDetails.friends];
      friendsCopy.forEach((friend) => {
        if (friend.id === action.payload.to.id)
          friend.latestMessage = [
            {
              _typename: action.payload._typename,
              content: action.payload.content,
              createdAt: action.payload.createdAt,
            },
          ];
      });
      friendsCopy.sort(
        (a, b) => new Date(b.latestMessage[0]?.createdAt) - new Date(a.latestMessage[0]?.createdAt)
      );
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          friends: friendsCopy,
          currMessages: messagesCopy,
        },
      };
    case "ADD_FRIEND":
      const fCopy = [...state.userDetails.friends, action.payload];

      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          friends: fCopy,
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
