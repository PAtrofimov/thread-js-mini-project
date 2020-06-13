export default models => {
  const {
    User,
    Post,
    PostReaction,
    Comment,
    CommentReaction,
    Image
  } = models;

  Image.hasOne(User);
  Image.hasOne(Post);

  User.hasMany(Post);
  User.hasMany(Comment);
  User.hasMany(PostReaction);
  User.hasMany(CommentReaction);
  User.belongsTo(Image);

  Post.belongsTo(Image);
  Post.belongsTo(User);
  Post.hasMany(PostReaction);
  Post.hasMany(CommentReaction);
  Post.hasMany(Comment);

  Comment.hasMany(CommentReaction);
  Comment.belongsTo(User);
  Comment.belongsTo(Post);

  PostReaction.belongsTo(Post);
  PostReaction.belongsTo(User);

  CommentReaction.belongsTo(Post);
  CommentReaction.belongsTo(Comment);
  CommentReaction.belongsTo(User);
};
