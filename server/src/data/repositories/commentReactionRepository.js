import { CommentReactionModel, CommentModel, PostModel } from '../models/index';
import BaseRepository from './baseRepository';

class CommentReactionRepository extends BaseRepository {
  getCommentReaction(userId, commentId) {
    return this.model.findOne({
      group: ['commentReaction.id', 'post.id', 'comment.id'],
      where: { userId, commentId },
      include: [
        {
          model: CommentModel,
          attributes: ['id', 'userId', 'postId']
        },
        {
          model: PostModel,
          attributes: ['id', 'userId']
        }
      ]
    });
  }
}

export default new CommentReactionRepository(CommentReactionModel);
