/* eslint-disable */
import * as postService from "src/services/postService";
import * as commentService from "src/services/commentService";
import {
  ADD_POST,
  UPDATE_POST,
  DELETE_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  SET_DELETED_POST,
  SET_UPDATED_POST,
  SET_EXPANDED_POST,
  SET_UPDATED_COMMENT,
} from "./actionTypes";

const setPostsAction = (posts) => ({
  type: SET_ALL_POSTS,
  posts,
});

const addMorePostsAction = (posts) => ({
  type: LOAD_MORE_POSTS,
  posts,
});

const addPostAction = (post) => ({
  type: ADD_POST,
  post,
});

const updatePostAction = (post) => ({
  type: UPDATE_POST,
  post,
});

const deletePostAction = (post) => ({
  type: DELETE_POST,
  post,
});

const setExpandedPostAction = (post) => ({
  type: SET_EXPANDED_POST,
  post,
});

const setUpdatedPostAction = (post) => ({
  type: SET_UPDATED_POST,
  post,
});

const setDeletedPostAction = (post) => ({
  type: SET_DELETED_POST,
  post,
});

const setUpdatedCommentAction = (comment) => ({
  type: SET_UPDATED_COMMENT,
  comment,
});

export const loadPosts = (filter) => async (dispatch) => {
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts));
};

export const loadMorePosts = (filter) => async (dispatch, getRootState) => {
  const {
    posts: { posts },
  } = getRootState();
  const loadedPosts = await postService.getAllPosts(filter);
  const filteredPosts = loadedPosts.filter(
    (post) => !(posts && posts.some((loadedPost) => post.id === loadedPost.id))
  );
  dispatch(addMorePostsAction(filteredPosts));
};

export const applyPost = (postId) => async (dispatch) => {
  const post = await postService.getPost(postId);
  dispatch(addPostAction(post));
};

export const addPost = (post) => async (dispatch) => {
  const { id } = await postService.addPost(post);
  const newPost = await postService.getPost(id);
  dispatch(addPostAction(newPost));
};

export const deletePost = (postId) => async (dispatch) => {
  const post = await postService.getPost(postId);
  const {result} = await postService.deletePost(postId);
  if (result === 1) {
     dispatch(deletePostAction(post));
  }
};

export const updatePost = (post) => async (dispatch) => {
  const { id } = await postService.updatePost(post);

  const editedPost = await postService.getPost(id);
  dispatch(updatePostAction(editedPost));
};

export const toggleExpandedPost = (postId) => async (dispatch) => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setExpandedPostAction(post));
};

export const toggleUpdatedPost = (postId) => async (dispatch) => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setUpdatedPostAction(post));
};

export const toggleDeletedPost = (postId) => async (dispatch) => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch(setDeletedPostAction(post));
};

export const toggleUpdatedComment = (comId) => async (dispatch) => {
  const comment = comId ? await commentService.getComment(comId) : undefined;
  dispatch(setUpdatedCommentAction(comment));
};

export const likePost = (postId) => async (dispatch, getRootState) => {
  const { id, createdAt, updatedAt } = await postService.likePost(postId);
  const diff = id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed

  const mapLikes = (post) => {
    // if modified then dislikeCount changes
    const dislikeCount = createdAt && createdAt !== updatedAt ? +post.dislikeCount - diff : +post.dislikeCount;
    return {
      ...post,
      dislikeCount,
      likeCount: +post.likeCount + diff, // diff is taken from the current closure
    };
  };

  const {
    posts: { posts, expandedPost },
  } = getRootState();
  const updated = posts.map((post) =>
    post.id !== postId ? post : mapLikes(post)
  );

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapLikes(expandedPost)));
  }
};

export const dislikePost = (postId) => async (dispatch, getRootState) => {
  const { id, createdAt, updatedAt } = await postService.dislikePost(postId);
  const diff = id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed

  const mapdislikes = (post) => {
    // if modified then likeCount changes
    const likeCount = createdAt && createdAt !== updatedAt ? +post.likeCount - diff : +post.likeCount;
    return {
      ...post,
      likeCount,
      dislikeCount: Number(post.dislikeCount) + diff, // diff is taken from the current closure
    };
  };

  const {
    posts: { posts, expandedPost },
  } = getRootState();
  const updated = posts.map((post) =>
    post.id !== postId ? post : mapdislikes(post)
  );

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === postId) {
    dispatch(setExpandedPostAction(mapdislikes(expandedPost)));
  }
};

export const addComment = (request) => async (dispatch, getRootState) => {
  const { id } = await commentService.addComment(request);
  const comment = await commentService.getComment(id);

  const mapComments = (post) => ({
    ...post,
    commentCount: Number(post.commentCount) + 1,
    comments: [...(post.comments || []), comment], // comment is taken from the current closure
  });

  const {
    posts: { posts, expandedPost },
  } = getRootState();
  const updated = posts.map((post) =>
    post.id !== comment.postId ? post : mapComments(post)
  );

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === comment.postId) {
    dispatch(setExpandedPostAction(mapComments(expandedPost)));
  }
};

export const updateComment = (request) => async (dispatch, getRootState) => {
  const { id } = await commentService.updateComment(request);
  const comment = await commentService.getComment(id);

  const mapComments = (post) => { 
    const {comments=[]} = post;
    const newComments = comments.map(it => {
      return (it.id === id) ? comment: it;
    });

    return {
    ...post,
    comments: [...newComments],
  }};

  const {
    posts: { posts, expandedPost },
  } = getRootState();
  const updated = posts.map((post) =>
    post.id !== comment.postId ? post : mapComments(post)
  );

  dispatch(setPostsAction(updated));

  if (expandedPost && expandedPost.id === comment.postId) {
    dispatch(setExpandedPostAction(mapComments(expandedPost)));
  }
};

