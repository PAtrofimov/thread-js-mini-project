import { Op } from 'sequelize';
import sequelize from '../db/connection';
import { UserModel, ImageModel } from '../models/index';
import BaseRepository from './baseRepository';

class UserRepository extends BaseRepository {
  
  getUsersOfPostByReaction(postId, isLike = true) {
    const where = {};

    Object.assign(where, {
      [Op.and]: [
        sequelize.literal(`id in (select "postReactions"."userId" 
            from "postReactions" as "postReactions"  
            WHERE "postReactions"."postId" = '${postId}' and "postReactions"."isLike" = ${isLike})`)
      ]
    });

    return this.model.findAll({
      where,
      attributes: ['id', 'username']
    });
  }

  getUsersOfCommentByReaction(commentId, isLike = true) {
    const where = {};

    Object.assign(where, {
      [Op.and]: [
        sequelize.literal(`id in (select "commentReactions"."userId" 
            from "commentReactions" as "commentReactions"  
            WHERE "commentReactions"."commentId" = '${commentId}' and "commentReactions"."isLike" = ${isLike})`)
      ]
    });

    return this.model.findAll({
      where,
      attributes: ['id', 'username']
    });
  }

  addUser(user) {
    return this.create(user);
  }

  getByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  getByUsername(username) {
    return this.model.findOne({ where: { username } });
  }

  getUserById(id) {
    return this.model.findOne({
      group: ['user.id', 'image.id'],
      where: { id },
      include: {
        model: ImageModel,
        attributes: ['id', 'link']
      }
    });
  }
}

export default new UserRepository(UserModel);
