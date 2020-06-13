import { Op } from 'sequelize';
import sequelize from '../db/connection';

import {
  PostModel,
  CommentModel,
  UserModel,
  ImageModel,
  CommentReactionModel,
  PostReactionModel
} from '../models/index';
import BaseRepository from './baseRepository';

const likeCase = bool =>
  `CASE WHEN "postReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;
const likeCaseComments = bool =>
  `CASE WHEN "commentReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class PostRepository extends BaseRepository {
  async getPosts(filter) {
    const { from: offset, count: limit, userId, conditionType = 'eq' } = filter;

    const where = {};
    if (userId) {
      Object.assign(where, { userId: { [Op[`${conditionType}`]]: userId } });
    }

    return this.model.findAll({
      where,
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "post"."id" = "comment"."postId")`),
            'commentCount'
          ],
          [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likeCount'],
          [
            sequelize.fn('SUM', sequelize.literal(likeCase(false))),
            'dislikeCount'
          ]
        ]
      },
      include: [
        {
          model: ImageModel,
          attributes: ['id', 'link']
        },
        {
          model: UserModel,
          attributes: ['id', 'username'],
          include: {
            model: ImageModel,
            attributes: ['id', 'link']
          }
        },
        {
          model: PostReactionModel,
          attributes: [],
          duplicating: false
        }
      ],
      group: ['post.id', 'image.id', 'user.id', 'user->image.id'],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
  }

  getPostById(id) {
    return this.model.findOne({
      group: [
        'post.id',
        'comments.id',
        'comments->user.id',
        'comments->user->image.id',
        'user.id',
        'user->image.id',
        'image.id'
      ],
      where: { id },
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(*)
          FROM "comments" as "comment"
          WHERE "post"."id" = "comment"."postId")`),
            'commentCount'
          ],
          [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likeCount'],
          [
            sequelize.fn('SUM', sequelize.literal(likeCase(false))),
            'dislikeCount'
          ]
        ]
      },
      include: [
        {
          model: CommentModel,
          attributes: {
            include: [
              [
                sequelize.fn('SUM', sequelize.literal(likeCaseComments(true))),
                'likeCount'
              ],
              [
                sequelize.fn('SUM', sequelize.literal(likeCaseComments(false))),
                'dislikeCount'
              ]
            ]
          },
          include: {
            model: UserModel,
            attributes: ['id', 'username'],
            include: {
              model: ImageModel,
              attributes: ['id', 'link']
            }
          }
        },
        {
          model: UserModel,
          attributes: ['id', 'username'],
          include: {
            model: ImageModel,
            attributes: ['id', 'link']
          }
        },
        {
          model: ImageModel,
          attributes: ['id', 'link']
        },
        {
          model: PostReactionModel,
          attributes: []
        },
        {
          model: CommentReactionModel,
          attributes: []
        }
      ]
    });
  }
}

export default new PostRepository(PostModel);
