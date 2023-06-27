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
  const post= await Posts.findOne({_id:postId})
  return await Posts.findOneAndUpdate(
    { _id: postId },
    {
      $push: { likes: { id: userId } },
    },
    { new: true }
  );
};

const deletePost = async (userId, postId) => {
  return await Posts.findOneAndDelete({ _id: postId, createdBy: userId });
};
const updatePost = async (userId, postId, caption) => {
  return await Posts.findOneAndUpdate(
    { $and: [{ createdBy: userId }, { _id: postId }] },
    { $set: { caption: caption } }
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
const savedPostsByUser = async (userId, postId) => {
  const userSaved = await User.findById(userId).populate({
    path: "saved.id",
    populate: {
      path: "createdBy",
    },
  });
  return userSaved;
};

const userSavedPost = async (userId, postId) => {
  try {
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
  } catch (error) {
    throw Error;
  }
};
const userUnSavePost = async (userId, postId) => {
  try {
    await Posts.updateOne(
      { _id: postId },
      {
        $pull: { saved: { id: userId } },
      }
    );
    await User.updateOne(
      { _id: userId },
      {
        $pull: { saved: { id: postId } },
      }
    );
  } catch (error) {
    throw Error;
  }
};
module.exports = {
  queryPosts,
  getPostsByUserId,
  userLikePost,
  userDislikePost,
  userSavedPost,
  userUnSavePost,
  deletePost,
  updatePost,
  savedPostsByUser,
};
