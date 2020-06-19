
import sequelize from '../db/connection';
import { CommentModel, UserModel, ImageModel, CommentReactionModel, PostModel } from '../models/index';
import BaseRepository from './baseRepository';

const likeCase = bool => `CASE WHEN "commentReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class CommentRepository extends BaseRepository {
  getCommentById(id) {
    return this.model.findOne({
      group: [
        'comment.id',
        'post.id',
        'user.id',
        'user->image.id'
      ],
      where: { id },
      attributes: {
        include: [
          [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likeCount'],
          [sequelize.fn('SUM', sequelize.literal(likeCase(false))), 'dislikeCount']
        ]
      },
      include: [{
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      },
      {
        model: PostModel,
        attributes: ['id', 'userId']
      },
      {
        model: CommentReactionModel,
        attributes: []
      }
      ]
    });
  }
}

export default new CommentRepository(CommentModel);
