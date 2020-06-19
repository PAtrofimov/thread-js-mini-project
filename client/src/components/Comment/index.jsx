/* eslint-disable arrow-parens, react/jsx-wrap-multilines */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Comment as CommentUI, Label, Icon, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
  showUsersByLikes,
  showUsersByDislikes
} from 'src/services/commentService';
import styles from './styles.module.scss';

const Comment = ({
  comment: {
    body,
    createdAt,
    user,
    id,
    postId,
    likeCount = 0,
    dislikeCount = 0
  },
  toggleUpdatedComment: toggle,
  toggleDeletedComment: toggleDel,
  likeComment,
  dislikeComment
}) => {
  const [usersLikedComment, setUsersLikedComment] = useState([]);
  const [usersDislikedComment, setUserDislikedComment] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const usersLiked = await showUsersByLikes(id);
      setUsersLikedComment(usersLiked.map((it) => it.username));
      const usersDisliked = await showUsersByDislikes(id);
      setUserDislikedComment(usersDisliked.map((it) => it.username));
    }

    fetchUsers();
  }, [dislikeCount, likeCount, id]);

  return (
    <CommentUI className={styles.comment}>
      <CommentUI.Avatar src={getUserImgLink(user.image)} />
      <CommentUI.Content>
        <CommentUI.Author as="a">{user.username}</CommentUI.Author>
        <CommentUI.Metadata>{moment(createdAt).fromNow()}</CommentUI.Metadata>
        <CommentUI.Text>{body}</CommentUI.Text>
        <CommentUI.Actions>
          <Label
            basic
            size="small"
            as="a"
            className={styles.toolbarBtn}
            onClick={() => likeComment(id, postId)}
          >
            <Popup
              className={styles.popup}
              content={
                usersLikedComment.length > 0
                  ? usersLikedComment.join(', ')
                  : 'No likes'
              }
              trigger={
                <div>
                  <Icon name="thumbs up" /> 
                  {likeCount || 0}
                </div>
              }
            />
          </Label>
          <Label
            basic
            size="small"
            as="a"
            className={styles.toolbarBtn}
            onClick={() => dislikeComment(id, postId)}
          >
            <Popup
              className={styles.popup}
              content={
                usersDislikedComment.length > 0
                  ? usersDislikedComment.join(', ')
                  : 'No dislikes'
              }
              trigger={
                <div>
                  <Icon name="thumbs down" /> 
                  {dislikeCount || 0}
                </div>
              }
            />
          </Label>
          <Label
            basic
            size="small"
            as="a"
            className={styles.toolbarBtn}
            onClick={() => toggle(id)}
          >
            <Icon name="edit" />
          </Label>
          <Label
            basic
            size="small"
            as="a"
            className={styles.toolbarBtn}
            onClick={() => toggleDel(id)}
          >
            <Icon name="delete" />
          </Label>
        </CommentUI.Actions>
      </CommentUI.Content>
    </CommentUI>
  );
};

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleUpdatedComment: PropTypes.func.isRequired,
  toggleDeletedComment: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired
};

export default Comment;
