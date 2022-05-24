const Posts = require("../models/posts.model");
const User = require("../models/user.model");

const queryPosts = async (filter, options) => {
  const posts = await Posts.paginate(filter, options);
  return posts;
};
const getPostsByUserId = async (filter, options) => {
  const posts = await Posts.paginate(filter, options);
  return posts;
};

const userLikePost = async (userId, postId) => {
  await Posts.updateOne(
    { _id: postId },
    {
      $push: { likes: { id: userId } },
    }
  );
};
const userDislikePost = async (userId, postId) => {
  await Posts.updateOne(
    { _id: postId },
    {
      $pullAll: { likes: [{ id: userId }] },
    }
  );
};

const userSavedPost = async (userId, postId) => {
  await Posts.updateOne(
    { _id: postId },
    {
      $push: { saved: { id: userId } },
    }
  );
  await User.updateOne(
    { _id: userId },
    {
      $push: { saved: { id: postId } },
    }
  );
};
const userUnSavePost = async (userId, postId) => {
  await Posts.updateOne(
    { _id: postId },
    {
      $pullAll: { saved: [{ id: userId }] },
    }
  );
  await User.updateOne(
    { _id: userId },
    {
      $pullAll: { saved: [{ id: postId }] },
    }
  );
};
module.exports = {
  queryPosts,
  getPostsByUserId,
  userLikePost,
  userDislikePost,
  userSavedPost,
  userUnSavePost,
};
