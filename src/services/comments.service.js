const comments = require("../models/comments.model");

const createComment = async (userId, postId, comment) => {
  const newComment = new comments({
    createdBy: userId,
    postId: postId,
    comment: comment,
  });
  await newComment.save();
};
const getPostComments = async (postId) => {
  const postComments = await comments
    .find({
      $and: [{ postId: postId }, { commentId: { $exists: false } }],
    })
    .populate({ path: "createdBy", select: "_id name image" })
    .populate({
      path: "reply.id",
      populate: {
        path: "createdBy",
      },
    })
    .sort({ createdAt: -1 });
  return postComments;
};

const userLikeComment = async (userId, commentId) => {
  await comments.updateOne(
    { _id: commentId },
    {
      $push: { likes: { id: userId } },
    }
  );
};
const userDislikeComment = async (userId, commentId) => {
  await comments.updateOne(
    { _id: commentId },
    {
      $pullAll: { likes: [{ id: userId }] },
    }
  );
};

const replyToComment = async (commentId, postId, userId, comment, next) => {
  try {
    const newReply = new comments({
      commentId: commentId,
      comment: comment,
      createdBy: userId,
      postId: postId,
    });
    const newComment = await newReply.save();
    console.log(newComment);
    await comments.updateOne(
      { $and: [{ _id: commentId, postId: postId }] },
      {
        $push: { reply: { id: newComment._id } },
      }
    );
    return true;
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
module.exports = {
  createComment,
  getPostComments,
  userLikeComment,
  userDislikeComment,
  replyToComment,
};
