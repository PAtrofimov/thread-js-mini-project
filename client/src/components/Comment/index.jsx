/* eslint-disable */
import React from 'react';
import PropTypes from "prop-types";
import { Comment as CommentUI, Label, Icon } from "semantic-ui-react";
import moment from "moment";
import { getUserImgLink } from "src/helpers/imageHelper";

import styles from "./styles.module.scss";

const Comment = ({ comment: { body, createdAt, user, id, postId, likeCount=0, dislikeCount=0 }, toggleUpdatedComment: toggle, toggleDeletedComment: toggleDel, likeComment, dislikeComment}) => (

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
          <Icon name="thumbs up" />
          {likeCount||0}
        </Label>
        <Label
          basic
          size="small"
          as="a"
          className={styles.toolbarBtn}
          onClick={() => dislikeComment(id, postId)}
        >
          <Icon name="thumbs down" />
          {dislikeCount||0}
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

Comment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Comment;
