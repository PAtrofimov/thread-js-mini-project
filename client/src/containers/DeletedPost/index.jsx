/* eslint-disable arrow-parens */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Image, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleDeletedPost } from 'src/containers/Thread/actions';
import styles from './styles.module.scss';

const DeletedPost = ({
  deletePost,
  post,
  toggleDeletedPost: toggleDeleted
}) => {
  const { id, image, body } = post;

  const handleDeletePost = async () => {
    await deletePost(id);
  };

  return (
    <Modal
      open
      onClose={() => {
        toggleDeleted();
      }}
    >
      <Modal.Header className={styles.header}>
        <span>Delete post</span>
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleDeletePost}>
          <Form.TextArea name="body" value={body} disabled />
          {image?.imageLink && (
            <div className={styles.imageWrapper}>
              <Image
                className={styles.image}
                src={image?.imageLink}
                alt="delete"
              />
            </div>
          )}

          <Button floated="right" color="blue" type="submit">
            Remove
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

DeletedPost.propTypes = {
  deletePost: PropTypes.func.isRequired,
  toggleDeletedPost: PropTypes.func.isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = (rootState) => ({
  post: rootState.posts.deletedPost
});

const actions = { toggleDeletedPost };

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeletedPost);
