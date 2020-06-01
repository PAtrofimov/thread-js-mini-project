/* eslint-disable */
import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as imageService from "src/services/imageService";
import ExpandedPost from "src/containers/ExpandedPost";
import Post from "src/components/Post";
import AddPost from "src/components/AddPost";
import UpdatedPost from "src/components/UpdatedPost";
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
  addPost,
  updatePost,
} from "./actions";

import styles from "./styles.module.scss";

const postsFilter = {
  userId: undefined,
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
  hasMorePosts,
  addPost: createPost,
  updatePost: changePost,
  likePost: like,
  dislikePost: dislike,
  toggleUpdatedPost: toggleUpdated,
  toggleExpandedPost: toggle,
}) => {
  const [sharedPostId, setSharedPostId] = useState(undefined);
  const [showOwnPosts, setShowOwnPosts] = useState(false);

  const [updatedPostId, setUpdatedPostId] = useState(undefined);

  const toggleShowOwnPosts = () => {
    setShowOwnPosts(!showOwnPosts);
    postsFilter.userId = showOwnPosts ? undefined : userId;
    postsFilter.from = 0;
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

  const updatePostId = (id) => {
    setUpdatedPostId(id);
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
          onChange={toggleShowOwnPosts}
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
            sharePost={sharePost}
            updatePost={updatePostId}
            key={post.id}
          />
        ))}
      </InfiniteScroll>
      {expandedPost && (
        <ExpandedPost sharePost={sharePost} updatePost={updatePostId} />
      )}
      {sharedPostId && (
        <SharedPostLink
          postId={sharedPostId}
          close={() => setSharedPostId(undefined)}
        />
      )}
      {updatedPostId && (
        <UpdatedPost
          post={updatedPost}
          updatePost={changePost}
          uploadImage={uploadImage}
          postId={updatedPostId}
          updatePost={changePost}
          close={() => {setUpdatedPostId(undefined);}}
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
  userId: PropTypes.string,
  loadPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  dislikePost: PropTypes.func.isRequired,
  toggleExpandedPost: PropTypes.func.isRequired,
  toggleUpdatedPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
};

Thread.defaultProps = {
  posts: [],
  hasMorePosts: true,
  expandedPost: undefined,
  updatedPost:  undefined,
  userId: undefined,
};

const mapStateToProps = (rootState) => ({
  posts: rootState.posts.posts,
  hasMorePosts: rootState.posts.hasMorePosts,
  expandedPost: rootState.posts.expandedPost,
  updatedPost: rootState.posts.updatedPost,
  userId: rootState.profile.user.id,
});

const actions = {
  loadPosts,
  loadMorePosts,
  likePost,
  dislikePost,
  toggleExpandedPost,
  toggleUpdatedPost,
  addPost,
  updatePost,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
