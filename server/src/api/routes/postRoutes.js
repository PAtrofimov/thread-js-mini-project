
import { Router } from 'express';
import * as postService from '../services/postService';
import * as userService from '../services/userService';

const router = Router();

router
  .get('/', (req, res, next) =>
    postService
      .getPosts(req.query)
      .then(posts => res.send(posts))
      .catch(next)
  )
  .get('/:id', (req, res, next) =>
    postService
      .getPostById(req.params.id)
      .then(post => res.send(post))
      .catch(next)
  )
  .post('/', (req, res, next) =>
    postService
      .create(req.user.id, req.body)
      .then(post => {
        req.io.emit('new_post', post); // notify all users that a new post was created
        return res.send(post);
      })
      .catch(next)
  )
  .delete('/:id', (req, res, next) =>
    postService
      .deleteById(req.params.id)
      .then(result => {
        return res.send({ result });
      })
      .catch(next)
  )

  .get('/react/:id', (req, res, next) =>
    userService
      .getUsersOfPostByReaction(req.query)
      .then(users => {
        return res.send(users);
      })
      .catch(next)
  )
  .put('/react', (req, res, next) =>
    postService
      .setReaction(req.user.id, req.body)
      .then(reaction => {
        if (reaction.post && reaction.post.userId !== req.user.id) {
          // notify a user if someone (not himself) liked his post
          req.io.to(reaction.post.userId).emit('like', 'Your post was liked!');
        }
        return res.send(reaction);
      })
      .catch(next)
  )

  .put('/:id', (req, res, next) =>
    postService
      .updateById(req.params.id, req.body)
      .then(post => {
        return res.send(post);
      })
      .catch(next)
  );

export default router;
