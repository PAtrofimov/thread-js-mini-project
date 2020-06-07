/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Form, Button, Icon, Modal } from "semantic-ui-react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { toggleDeletedComment } from "src/containers/Thread/actions";
import styles from "./styles.module.scss";

const DeletedComment = ({ comment, deleteComment, toggleDeletedComment }) => {
  const body = comment?.body;

  const handleDeleteComment = async () => {
    if (comment) {
      await deleteComment(comment?.id);
    }
  };

  return (
    <Modal open onClose={() => toggleDeletedComment()}>
      <Modal.Header className={styles.header}>
        <span>Delete Comment</span>
      </Modal.Header>
      <Modal.Content>
        <Form reply onSubmit={handleDeleteComment}>
          <Form.TextArea
            value={body}
            disabled
          />
          <Button
            type="submit"
            content="Delete comment"
            labelPosition="left"
            icon="delete"
            primary
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

DeletedComment.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  toggleDeletedComment: PropTypes.func.isRequired,
  comment: PropTypes.objectOf(PropTypes.any),
};

const mapStateToProps = (rootState) => ({
  comment: rootState.posts.deletedComment,
});

const actions = { toggleDeletedComment };

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeletedComment);
