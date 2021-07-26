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

    case "LIKE_POST":
      let newPosts = [...state.posts];
      let likes = [];
      newPosts.forEach((post) => {
        if (post.id === action.id) {
          likes = [...post.likes];
          let filteredLikes = likes.filter((item) => item.id !== action.payload);
          if (likes.length === filteredLikes.length) likes = [...likes, { id: action.payload }];
          else likes = [...filteredLikes];
        }
      });
      return {
        ...state,
        posts: newPosts.map((post) => (post.id === action.id ? { ...post, likes } : post)),
      };
    case "DELETE_POST":
      let remPosts = [...state.posts];
      return {
        ...state,
        posts: remPosts.filter((post) => post.id !== action.payload),
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
