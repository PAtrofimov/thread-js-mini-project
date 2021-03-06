/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Modal } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleUpdatedComment } from 'src/containers/Thread/actions';
import styles from './styles.module.scss';

const UpdatedComment = ({
  comment,
  updateComment,
  toggleUpdatedComment: toggleUpdated
}) => {
  const [body, setBody] = useState(comment?.body);

  const close = () => {
    toggleUpdated();
  };

  const handleUpdateComment = async () => {
    if (!body) {
      return;
    }
    await updateComment({ id: comment?.id, body });
    close();
  };

  return (
    <Modal open onClose={close}>
      <Modal.Header className={styles.header}>
        <span>Update Comment</span>
      </Modal.Header>
      <Modal.Content>
        <Form reply onSubmit={handleUpdateComment}>
          <Form.TextArea
            value={body}
            placeholder="Type a comment..."
            onChange={(ev) => setBody(ev.target.value)}
          />
          <Button
            type="submit"
            content="Edit comment"
            labelPosition="left"
            icon="edit"
            primary
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

UpdatedComment.propTypes = {
  updateComment: PropTypes.func.isRequired,
  toggleUpdatedComment: PropTypes.func.isRequired,
  comment: PropTypes.objectOf(PropTypes.any).isRequired
};

const mapStateToProps = (rootState) => ({
  comment: rootState.posts.updatedComment
});

const actions = { toggleUpdatedComment };

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UpdatedComment);
