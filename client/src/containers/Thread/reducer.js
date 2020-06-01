/* eslint-disable */
import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  UPDATE_POST,
  SET_UPDATED_POST,
  SET_EXPANDED_POST,
} from "./actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ALL_POSTS:
      return {
        ...state,
        posts: action.posts,
        hasMorePosts: Boolean(action.posts.length),
      };
    case LOAD_MORE_POSTS:
      return {
        ...state,
        posts: [...(state.posts || []), ...action.posts],
        hasMorePosts: Boolean(action.posts.length),
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.post, ...state.posts],
      };
    case UPDATE_POST:
      const { id, text, image } = action.post;

      const mapEdited = (post) => ({ ...post, text, image });

      const posts = state.posts.map((post) => {
        {
          return post.id == !id ? post : mapEdited(post);
        }
      });

      return {
        ...state,
        posts,
      };
    case SET_UPDATED_POST:
      return {
        ...state,
        updatedPost: action.post,
      };
    case SET_EXPANDED_POST:
      return {
        ...state,
        expandedPost: action.post,
      };
    default:
      return state;
  }
};
