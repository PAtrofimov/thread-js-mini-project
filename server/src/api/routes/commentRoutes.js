import { Router } from 'express';
import * as commentService from '../services/commentService';

const router = Router();

router
  .get('/:id', (req, res, next) => commentService.getCommentById(req.params.id)
    .then(comment => res.send(comment))
    .catch(next))
  .post('/', (req, res, next) => commentService.create(req.user.id, req.body)
    .then(comment => res.send(comment))
    .catch(next))
  .delete('/:id', (req, res, next) => commentService.deleteById(req.params.id)
    .then(result => res.send({ result }))
    .catch(next))
  .put('/react', (req, res, next) => commentService.setReaction(req.user.id, req.body)
    .then(reaction => {
      if (reaction.comment && (reaction.comment.userId !== req.user.id)) {
        // notify a user if someone (not himself) liked his comment
        req.io.to(reaction.comment.userId).emit('like', 'Your comment was liked!');
      }
      return res.send(reaction);
    })
    .catch(next))
  .put('/:id', (req, res, next) => commentService.updateById(req.params.id, req.body)
    .then(comment => res.send(comment))
    .catch(next));

export default router;
