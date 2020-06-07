import commentRepository from '../../data/repositories/commentRepository';

export const create = (userId, comment) => commentRepository.create({
  ...comment,
  userId
});

export const updateById = (id, comment) => commentRepository.updateById(id, {
  ...comment
});

export const getCommentById = id => commentRepository.getCommentById(id);

export const deleteById = id => commentRepository.deleteById(id);
