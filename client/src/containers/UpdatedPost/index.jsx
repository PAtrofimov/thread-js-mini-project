/* eslint-disable */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Icon, Image, Modal } from "semantic-ui-react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { toggleUpdatedPost } from "src/containers/Thread/actions";
import styles from "./styles.module.scss";

const UpdatedPost = ({ post, updatePost, uploadImage, toggleUpdatedPost }) => {
  const [body, setBody] = useState(post?.body);
  const [image, setImage] = useState({ imageId: post?.imageId, imageLink: post?.image?.link });
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdatePost = async () => {
    if (!body) {
      return;
    }
    await updatePost({ id: post?.id, imageId: image?.imageId, body });
  };

  const handleUploadFile = async ({ target }) => {
    setIsUploading(true);
    try {
      const { id: imageId, link: imageLink } = await uploadImage(
        target.files[0]
      );
      setImage({ imageId, imageLink });
    } finally {
      // TODO: show error
      setIsUploading(false);
    }
  };

  return (
    <Modal open onClose={()=> {toggleUpdatedPost();}}>
      <Modal.Header className={styles.header}>
        <span>Update Post</span>
      </Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleUpdatePost}>
          <Form.TextArea
            name="body"
            value={body}
            placeholder="What is the news?"
            onChange={(ev) => setBody(ev.target.value)}
          />
          {image?.imageLink && (
            <div className={styles.imageWrapper}>
              <Image
                className={styles.image}
                src={image?.imageLink}
                alt="post"
              />
            </div>
          )}
          <Button
            color="teal"
            icon
            labelPosition="left"
            as="label"
            loading={isUploading}
            disabled={isUploading}
          >
            <Icon name="image" />
            Attach image
            <input
              name="image"
              type="file"
              onChange={handleUploadFile}
              hidden
            />
          </Button>
          <Button floated="right" color="blue" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

UpdatedPost.propTypes = {
  updatePost: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

const mapStateToProps = (rootState) => ({
  post: rootState.posts.updatedPost,
});

const actions = { toggleUpdatedPost };

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UpdatedPost);
