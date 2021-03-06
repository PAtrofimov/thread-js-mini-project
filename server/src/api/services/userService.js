import userRepository from '../../data/repositories/userRepository';

export const getUserById = async userId => {
  const {
    id,
    username,
    email,
    imageId,
    image
  } = await userRepository.getUserById(userId);
  return { id, username, email, imageId, image };
};

export const getUsersOfPostByReaction = ({ postId, isLike }) =>
  userRepository.getUsersOfPostByReaction(postId, isLike);

export const getUsersOfCommentByReaction = ({ commentId, isLike }) =>
  userRepository.getUsersOfCommentByReaction(commentId, isLike);
