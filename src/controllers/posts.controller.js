const Posts = require("../models/posts.model");
const {
  queryPosts,
  getPostsByUserId,
  userLikePost,
  userDislikePost,
  userSavedPost,
  userUnSavePost,
} = require("../services/posts.service");
const {
  uploadToCloudinary,
  multipleImages,
} = require("../services/upload.service");
const pick = require("../utils/pick");

const uploadPost = async (req, res, next) => {
  const { caption } = req.body;
  // let localFilePath = req.file.path;
  console.log(req.files);
  let result = await multipleImages(req.files, "feedImages");
  console.log(result);
  const dataPost = {
    image: result,
    caption: caption,
    likes: [],

    createdBy: req.user.id,
  };
  try {
    const newPost = new Posts(dataPost);
    await newPost.save();
    res.status(201).send({ message: "uploaded successfully" });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  const filter = pick(req.query, ["image"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const posts = await queryPosts(filter, {
    ...options,
    populate: [{ path: "createdBy", select: "_id name email image" }],
  });
  res.status(200).send(posts);
};
const getUserPosts = async (req, res, next) => {
  const filter = { createdBy: req.user._id };
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const posts = await getPostsByUserId(filter, {
    ...options,

    populate: [{ path: "createdBy", select: "_id name email " }],
  });
  res.status(200).send(posts);
};
const getUserIdPosts = async (req, res, next) => {
  const filter = { createdBy: req.params.userId };
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const posts = await getPostsByUserId(filter, {
    ...options,

    populate: [{ path: "createdBy", select: "_id name email " }],
  });
  res.status(200).send(posts);
};

const likePost = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  try {
    userLikePost(_id, postId);
    res.status(201).send({ message: "you have liked" });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

//this function to disLike post

const dislikePost = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  try {
    userDislikePost(_id, postId);
    console.log("first");
    res.status(202).send({ message: "you have disliked" });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const savePost = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  try {
    userSavedPost(_id, postId);
    res.status(201).send({ message: "you have liked" });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
const unSavePost = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;
  try {
    userUnSavePost(_id, postId);
    res.status(201).send({ message: "you have liked" });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
module.exports = {
  uploadPost,
  getAllPosts,
  getUserPosts,
  getUserIdPosts,
  dislikePost,
  likePost,
};
