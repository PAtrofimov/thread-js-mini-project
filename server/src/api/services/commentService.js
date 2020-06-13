import commentRepository from '../../data/repositories/commentRepository';
import CommentReactionRepository from '../../data/repositories/commentReactionRepository';

export const create = (userId, comment) => commentRepository.create({
  ...comment,
  userId
});

export const updateById = (id, comment) => commentRepository.updateById(id, {
  ...comment
});

export const getCommentById = id => commentRepository.getCommentById(id);

export const deleteById = id => commentRepository.deleteById(id);

export const setReaction = async (userId, { commentId, isLike = true, postId }) => {
  // define the callback for future use as a promise
  const updateOrDelete = react => (react.isLike === isLike
    ? CommentReactionRepository.deleteById(react.id)
    : CommentReactionRepository.updateById(react.id, { isLike }));

  const reaction = await CommentReactionRepository.getCommentReaction(userId, commentId);

  const result = reaction
    ? await updateOrDelete(reaction)
    : await CommentReactionRepository.create({ userId, commentId, postId, isLike });

  // the result is an integer when an entity is deleted
  return Number.isInteger(result) ? {} : CommentReactionRepository.getCommentReaction(userId, commentId);
};
