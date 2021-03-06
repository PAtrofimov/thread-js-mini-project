/* eslint-disable arrow-parens, react/jsx-wrap-multilines */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Label, Icon, Popup } from 'semantic-ui-react';
import moment from 'moment';
import {
  showUsersByLikes,
  showUsersByDislikes
} from 'src/services/postService';
import styles from './styles.module.scss';

const Post = ({
  post,
  own,
  likePost,
  dislikePost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleDeletedPost,
  sharePost
}) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;

  const [usersLikedPost, setUsersLikedPost] = useState([]);
  const [usersDislikedPost, setUserDislikedPost] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const usersLiked = await showUsersByLikes(id);
      setUsersLikedPost(usersLiked.map((it) => it.username));
      const usersDisliked = await showUsersByDislikes(id);
      setUserDislikedPost(usersDisliked.map((it) => it.username));
    }

    fetchUsers();
  }, [dislikeCount, likeCount, id]);

  const date = moment(createdAt).fromNow();
  return (
    <Card style={{ width: '100%'}}>
      {image && <Image src={image.link} wrapped ui={false} style={{ maxWidth: '100%', maxHeight: '400px'}} />}
      <Card.Content>
        <Card.Meta>
          <span className="date">
            posted by
            {user.username}
            {' - '}
            {date}
          </span>
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Label
          basic
          size="small"
          as="a"
          className={styles.toolbarBtn}
          onClick={() => likePost(id)}
        >
          <Popup
            className={styles.popup}
            content={
              usersLikedPost.length > 0 ? usersLikedPost.join(', ') : 'No likes'
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
          onClick={() => dislikePost(id)}
        >
          <Popup
            className={styles.popup}
            content={
              usersDislikedPost.length > 0
                ? usersDislikedPost.join(', ')
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
          onClick={() => toggleExpandedPost(id)}
        >
          <Icon name="comment" />
          {commentCount}
        </Label>
        <Label
          basic
          size="small"
          as="a"
          className={styles.toolbarBtn}
          onClick={() => sharePost(id)}
        >
          <Icon name="share alternate" />
        </Label>
        {own && (
          <Label
            basic
            size="small"
            as="a"
            className={styles.toolbarBtn}
            onClick={() => toggleUpdatedPost(id)}
          >
            <Icon name="edit" />
          </Label>
        )}
        {own && (
          <Label
            basic
            size="small"
            as="a"
            className={styles.toolbarBtn}
            onClick={() => toggleDeletedPost(id)}
          >
            <Icon name="delete" />
          </Label>
        )}
      </Card.Content>
    </Card>
  );
};

Post.defaultProps = {
  own: undefined
};

Post.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  own: PropTypes.bool,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleUpdatedPost: PropTypes.func.isRequired,
  toggleDeletedPost: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired
};

export default Post;
