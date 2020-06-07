/* eslint-disable */
import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  DELETE_POST,
  UPDATE_POST,
  SET_UPDATED_POST,
  SET_DELETED_POST,
  SET_EXPANDED_POST,
  SET_UPDATED_COMMENT,
  SET_DELETED_COMMENT,
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
      const { id, body, image } = action.post;

      const mapEdited = (post) => ({ ...post, body, image });

      const posts = state.posts.map((post) => {
        {
          return post.id === id ? mapEdited(post) : post;
        }
      });

      const expandedPost = state.expandedPost && state.expandedPost.id === id ? action.post : state.expandedPost;

      return {
        ...state,
        posts,
        expandedPost,
      };
    case DELETE_POST:
      const { id: deletedPostId } = action.post;
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== deletedPostId),
        expandedPost: state.expandedPost && state.expandedPost.id === deletedPostId ? undefined : state.expandedPost,
        updatedPost: state.updatedPost && state.updatedPost.id === deletedPostId ? undefined : state.updatedPost,
      };
    case SET_UPDATED_POST:
      return {
        ...state,
        updatedPost: action.post,
      };
    case SET_DELETED_POST:
      return {
        ...state,
        deletedPost: action.post,
      };
    case SET_EXPANDED_POST:
      return {
        ...state,
        expandedPost: action.post,
      };
    case SET_UPDATED_COMMENT:
      return {
        ...state,
        updatedComment: action.comment,
      };
    case SET_DELETED_COMMENT:
      return {
        ...state,
        deletedComment: action.comment,
      };
    default:
      return state;
  }
};
