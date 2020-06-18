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
    const {
      from: offset,
      count: limit,
      userId,
      userConditionType = 'eq',
      likedUserId
    } = filter;

    const where = {};
    const likedByMeCase = likedUserId
      ? `CASE WHEN "postReactions"."isLike" = true 
    and "postReactions"."userId" = '${likedUserId}'
    THEN 1 ELSE 0 END`
      : '0';

    if (userId) {
      Object.assign(where, {
        userId: { [Op[`${userConditionType}`]]: userId }
      });
    }

    if (likedUserId) {
      Object.assign(where, {
        [Op.and]: [
          sequelize.literal(`"post"."id" in (select "postReaction"."postId" from "postReactions" as "postReaction"
          where "postReaction"."isLike" = true and "postReaction"."userId" = '${likedUserId}')`)
        ]
      });
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
          [sequelize.fn('MAX', sequelize.literal(likedByMeCase)), 'likedByMe'],

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
          [
            sequelize.literal(`(SELECT SUM(${likeCase(true)})
          FROM "postReactions" as "postReactions"
          WHERE "post"."id" = "postReactions"."postId")`),
            'likeCount'
          ],
          [
            sequelize.literal(`(SELECT SUM(${likeCase(false)})
          FROM "postReactions" as "postReactions"
          WHERE "post"."id" = "postReactions"."postId")`),
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
                sequelize.literal(`(SELECT SUM(${likeCaseComments(true)})
              FROM "commentReactions" as "commentReactions"
              WHERE "comments"."id" = "commentReactions"."commentId")`),
                'likeCount'
              ],
              [
                sequelize.literal(`(SELECT SUM(${likeCaseComments(false)})
              FROM "commentReactions" as "commentReactions"
              WHERE "comments"."id" = "commentReactions"."commentId")`),
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
          attributes: [],
          duplicating: false
        },
        {
          model: CommentReactionModel,
          attributes: [],
          duplicating: false
        }
      ]
    });
  }
}

export default new PostRepository(PostModel);
