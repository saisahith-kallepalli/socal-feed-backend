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
  return await Posts.findOneAndUpdate(
    { _id: postId },
    {
      $push: { likes: { id: userId } },
    },
    { new: true }
  );
};
const userDislikePost = async (userId, postId) => {
  const user = await User.findById(userId);
  console.log(user._id);
  return await Posts.findOneAndUpdate(
    { _id: postId },
    {
      $pull: { likes: { id: userId } },
    },
    { new: true }
  );
};

const userSavedPost = async (userId, postId) => {
  await Posts.updateOne(
    { _id: postId },
    {
      $push: { saved: { id: userId } },
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
};
module.exports = {
  queryPosts,
  getPostsByUserId,
  userLikePost,
  userDislikePost,
  userSavedPost,
  userUnSavePost,
};
