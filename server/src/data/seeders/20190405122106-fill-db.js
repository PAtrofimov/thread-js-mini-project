/* eslint-disable no-console */
import { usersSeed, userImagesSeed } from '../seed-data/usersSeed';
import { postsSeed, postImagesSeed } from '../seed-data/postsSeed';
import commentsSeed from '../seed-data/commentsSeed';
import postReactionsSeed from '../seed-data/postReactionsSeed';
import commentReactionsSeed from '../seed-data/commentReactionsSeed';

const randomIndex = length => Math.floor(Math.random() * length);
const mapLinks = images => images.map(x => `'${x.link}'`).join(',');

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      const options = {
        type: Sequelize.QueryTypes.SELECT
      };

      // Add images.
      await queryInterface.bulkInsert('images', userImagesSeed.concat(postImagesSeed), {});

      const userImagesQuery = `SELECT id FROM "images" WHERE link IN (${mapLinks(userImagesSeed)});`;
      const userImages = await queryInterface.sequelize.query(userImagesQuery, options);

      const postImagesQuery = `SELECT id FROM "images" WHERE link IN (${mapLinks(postImagesSeed)});`;
      const postImages = await queryInterface.sequelize.query(postImagesQuery, options);

      // Add users.
      const usersMappedSeed = usersSeed.map((user, i) => ({
        ...user,
        imageId: userImages[i] ? userImages[i].id : null
      }));
      await queryInterface.bulkInsert('users', usersMappedSeed, {});
      const users = await queryInterface.sequelize.query('SELECT id FROM "users";', options);

      // Add posts.
      const postsMappedSeed = postsSeed.map((post, i) => ({
        ...post,
        userId: users[randomIndex(users.length)].id,
        imageId: postImages[i] ? postImages[i].id : null
      }));
      await queryInterface.bulkInsert('posts', postsMappedSeed, {});
      const posts = await queryInterface.sequelize.query('SELECT id FROM "posts";', options);

      // Add comments.
      const commentsMappedSeed = commentsSeed.map(comment => ({
        ...comment,
        userId: users[randomIndex(users.length)].id,
        postId: posts[randomIndex(posts.length)].id
      }));
      await queryInterface.bulkInsert('comments', commentsMappedSeed, {});

      // Add post reactions.
      const postReactionsMappedSeed = postReactionsSeed.map(reaction => ({
        ...reaction,
        userId: users[randomIndex(users.length)].id,
        postId: posts[randomIndex(posts.length)].id
      }));
      await queryInterface.bulkInsert('postReactions', postReactionsMappedSeed, {});

      // Add comment reactions.
      const comments = await queryInterface.sequelize.query('SELECT id FROM "comments";', options);
      const commentReactionsMappedSeed = commentReactionsSeed.map(reaction => ({
        ...reaction,
        userId: users[randomIndex(users.length)].id,
        postId: posts[randomIndex(posts.length)].id,
        commentId: comments[randomIndex(comments.length)].id
      }));

      await queryInterface.bulkInsert('commentReactions', commentReactionsMappedSeed, {});
    } catch (err) {
      console.log(`Seeding error: ${err}`);
    }
  },

  down: async queryInterface => {
    try {
      await queryInterface.bulkDelete('postReactions', null, {});
      await queryInterface.bulkDelete('commentReactions', null, {});
      await queryInterface.bulkDelete('comments', null, {});
      await queryInterface.bulkDelete('posts', null, {});
      await queryInterface.bulkDelete('users', null, {});
      await queryInterface.bulkDelete('images', null, {});
    } catch (err) {
      console.log(`Seeding error: ${err}`);
    }
  }
};
