/* eslint-disable */
import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as imageService from "src/services/imageService";
import ExpandedPost from "src/containers/ExpandedPost";
import Post from "src/components/Post";
import AddPost from "src/components/AddPost";
import UpdatedPost from "src/containers/UpdatedPost";
import DeletedPost from "src/containers/DeletedPost";
import SharedPostLink from "src/components/SharedPostLink";
import { Checkbox, Loader } from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroller";
import {
  loadPosts,
  loadMorePosts,
  likePost,
  dislikePost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleDeletedPost,
  addPost,
  deletePost,
  updatePost,
} from "./actions";

import styles from "./styles.module.scss";

const postsFilter = {
  userId: undefined,
  userConditionType: undefined,
  likedUserId: undefined,
  from: 0,
  count: 10,
};

const Thread = ({
  userId,
  loadPosts: load,
  loadMorePosts: loadMore,
  posts = [],
  expandedPost,
  updatedPost,
  deletedPost,
  hasMorePosts,
  addPost: createPost,
  deletePost: removePost,
  updatePost: changePost,
  likePost: like,
  dislikePost: dislike,
  toggleUpdatedPost: toggleUpdated,
  toggleDeletedPost: toggleDeleted,
  toggleExpandedPost: toggle,
}) => {
  const [sharedPostId, setSharedPostId] = useState(undefined);
  const [showOwnPosts, setShowOwnPosts] = useState(false);
  const [hideOwnPosts, setHideOwnPosts] = useState(false);
  const [showLikedPosts, setShowLikedPosts] = useState(false);

  const toggleShowOwnPosts = () => {
    setShowOwnPosts(!showOwnPosts);
    postsFilter.userId = showOwnPosts ? undefined : userId;
    postsFilter.from = 0;
    postsFilter.userConditionType = undefined;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const toggleHideOwnPosts = () => {
    setHideOwnPosts(!hideOwnPosts);
    postsFilter.userId = hideOwnPosts ? undefined : userId;
    postsFilter.from = 0;
    postsFilter.userConditionType = hideOwnPosts ? undefined : 'ne';
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const toggleShowLikedPosts = () => {
    setShowLikedPosts(!showLikedPosts);
    postsFilter.userId = (hideOwnPosts || showOwnPosts) ? userId : undefined;
    postsFilter.from = 0;
    postsFilter.userConditionType = hideOwnPosts ? 'ne' : undefined;
    postsFilter.likedUserId = showLikedPosts ? undefined : userId;
    load(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  };

  const getMorePosts = () => {
    loadMore(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  };

  const sharePost = (id) => {
    setSharedPostId(id);
  };

  const uploadImage = (file) => imageService.uploadImage(file);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost addPost={createPost} uploadImage={uploadImage} />
      </div>
      <div className={styles.toolbar}>
        <Checkbox
          toggle
          label="Show only my posts"
          checked={showOwnPosts}
          disabled={hideOwnPosts}
          onChange={toggleShowOwnPosts}
        />
          <Checkbox
          toggle
          label="Hide my posts"
          checked={hideOwnPosts}
          disabled={showOwnPosts}
          onChange={toggleHideOwnPosts}
        />
         <Checkbox
          toggle
          label="Show liked posts"
          checked={showLikedPosts}        
          onChange={toggleShowLikedPosts}
        />
      </div>
      <InfiniteScroll
        pageStart={0}
        loadMore={getMorePosts}
        hasMore={hasMorePosts}
        loader={<Loader active inline="centered" key={0} />}
      >
        {posts.map((post) => (
          <Post
            post={post}
            likePost={like}
            dislikePost={dislike}
            toggleExpandedPost={toggle}
            toggleUpdatedPost={toggleUpdated}
            toggleDeletedPost={toggleDeleted}
            sharePost={sharePost}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
      {expandedPost && (
        <ExpandedPost sharePost={sharePost} updatePost={changePost} deletePost={removePost} />
      )}
      {sharedPostId && (
        <SharedPostLink
          postId={sharedPostId}
          close={() => setSharedPostId(undefined)}
        />
      )}
      {updatedPost && updatedPost.userId === userId && (
        <UpdatedPost
          uploadImage={uploadImage}
          updatePost={changePost}
        />
      )}
      {deletedPost && deletedPost.userId === userId && (
        <DeletedPost
          deletePost={removePost}
        />
      )}
    </div>
  );
};

Thread.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  hasMorePosts: PropTypes.bool,
  expandedPost: PropTypes.objectOf(PropTypes.any),
  updatedPost: PropTypes.objectOf(PropTypes.any),
  deletedPost: PropTypes.objectOf(PropTypes.any),
  userId: PropTypes.string,
  loadPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleUpdatedPost: PropTypes.func.isRequired,
  toggleDeletedPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
};

Thread.defaultProps = {
  posts: [],
  hasMorePosts: true,
  expandedPost: undefined,
  updatedPost: undefined,
  deletedPost: undefined,
  userId: undefined,
};

const mapStateToProps = (rootState) => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  updatedPost: rootState.posts.updatedPost,
  deletedPost: rootState.posts.deletedPost,
  userId: rootState.profile.user.id,
});

const actions = {
  loadPosts,
  loadMorePosts,
  likePost,
  dislikePost,
  toggleExpandedPost,
  toggleUpdatedPost,
  toggleDeletedPost,
  addPost,
  deletePost,
  updatePost,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
