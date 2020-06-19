/* eslint-disable arrow-parens */
import callWebApi from 'src/helpers/webApiHelper';

export const addComment = async (request) => {
  const response = await callWebApi({
    endpoint: '/api/comments',
    type: 'POST',
    request
  });
  return response.json();
};

export const updateComment = async (request) => {
  const response = await callWebApi({
    endpoint: `/api/comments/${request.id}`,
    type: 'PUT',
    request
  });
  return response.json();
};

export const getComment = async (id) => {
  const response = await callWebApi({
    endpoint: `/api/comments/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const deleteComment = async (id) => {
  const response = await callWebApi({
    endpoint: `/api/comments/${id}`,
    type: 'DELETE'
  });
  return response.json();
};

export const likeComment = async (commentId, postId) => {
  const response = await callWebApi({
    endpoint: '/api/comments/react',
    type: 'PUT',
    request: {
      commentId,
      postId,
      isLike: true
    }
  });
  return response.json();
};

export const dislikeComment = async (commentId, postId) => {
  const response = await callWebApi({
    endpoint: '/api/comments/react',
    type: 'PUT',
    request: {
      commentId,
      postId,
      isLike: false
    }
  });
  return response.json();
};

export const showUsersByLikes = async (commentId) => {
  const response = await callWebApi({
    endpoint: `/api/comments/react/${commentId}`,
    type: 'GET',
    query: {
      commentId,
      isLike: true
    }
  });
  return response.json();
};

export const showUsersByDislikes = async (commentId) => {
  const response = await callWebApi({
    endpoint: `/api/comments/react/${commentId}`,
    type: 'GET',
    query: {
      commentId,
      isLike: false
    }
  });
  return response.json();
};
