import { createContext, useContext, useReducer } from "react";

const PostsStateContext = createContext();
const PostsDispatchContext = createContext();

const postsReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload,
      };
    case "ADD_POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    default:
      throw new Error("Unknow action type:", action.type);
  }
};

export const PostsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, { posts: null });
  return (
    <PostsDispatchContext.Provider value={dispatch}>
      <PostsStateContext.Provider value={state}>{children}</PostsStateContext.Provider>
    </PostsDispatchContext.Provider>
  );
};

export const usePostsState = () => useContext(PostsStateContext);
export const usePostsDispatch = () => useContext(PostsDispatchContext);
