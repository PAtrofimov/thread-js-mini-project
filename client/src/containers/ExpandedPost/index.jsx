/* eslint-disable */
import React from 'react';
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Modal, Comment as CommentUI, Header } from "semantic-ui-react";
import moment from "moment";
import {
  likePost,
  dislikePost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleDeletedPost,
  likeComment,
  dislikeComment,
  addComment,
  updateComment,
  deleteComment,
  toggleUpdatedComment,
  toggleDeletedComment,
} from "src/containers/Thread/actions";
import Post from "src/components/Post";
import Comment from "src/components/Comment";
import AddComment from "src/components/AddComment";
import Spinner from "src/components/Spinner";
import UpdatedComment from 'src/containers/UpdatedComment';
import DeletedComment from 'src/containers/DeletedComment';

const ExpandedPost = ({
  post,
  sharePost,
  likePost: like,
  dislikePost: dislike,
  likeComment: likeCom,
  dislikeComment: dislikeCom,
  toggleExpandedPost: toggle,
  toggleUpdatedPost: toggleUpdated,
  toggleDeletedPost: toggleDeleted,
  toggleUpdatedComment: toggleUpdatedCom,
  toggleDeletedComment: toggleDeletedCom,
  addComment: add,
  updateComment: update,
  deleteComment: deleteCom,
  updatedComment,
  deletedComment,
  userId
}) => (
    <Modal dimmer="blurring" centered={false} open onClose={() => { toggle(); }}>
      {post ? (
        <Modal.Content>
          <Post
            post={post}
            likePost={like}
            dislikePost={dislike}
            toggleExpandedPost={toggle}
            toggleUpdatedPost={toggleUpdated}
            toggleDeletedPost={toggleDeleted}
            sharePost={sharePost}
          />
          <CommentUI.Group style={{ maxWidth: "100%" }}>
            <Header as="h3" dividing>
              Comments
          </Header>
            {post.comments &&
              post.comments
                .sort((c1, c2) => moment(c1.createdAt).diff(c2.createdAt))
                .map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    toggleUpdatedComment={toggleUpdatedCom}
                    toggleDeletedComment={toggleDeletedCom}
                    likeComment={likeCom}
                    dislikeComment={dislikeCom}
                  />
                )
                )}
            <AddComment postId={post.id} addComment={add} />

            {updatedComment && updatedComment.userId === userId && (
              <UpdatedComment updateComment={update} />)}

            {deletedComment && deletedComment.userId === userId && (
              <DeletedComment deleteComment={deleteCom} />)}

          </CommentUI.Group>
        </Modal.Content>
      ) : (
          <Spinner />
        )}
    </Modal>
  );

ExpandedPost.defaultProps = {
  post: undefined,
  userId: undefined,
  updatedComment: undefined,
  deletedComment: undefined,
};

ExpandedPost.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleUpdatedPost: PropTypes.func.isRequired,
  toggleDeletedPost: PropTypes.func.isRequired,
  toggleUpdatedComment: PropTypes.func.isRequired,
  toggleDeletedComment: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
};

const mapStateToProps = (rootState) => ({
  post: rootState.posts.expandedPost,
  updatedComment: rootState.posts.updatedComment,
  deletedComment: rootState.posts.deletedComment,
  userId: rootState.profile.user.id,
});

const actions = {
  likePost, dislikePost, likeComment, dislikeComment,
  toggleExpandedPost, addComment, toggleUpdatedPost, toggleDeletedPost,
  updateComment, deleteComment, toggleUpdatedComment, toggleDeletedComment,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedPost);
