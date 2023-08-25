const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const User = require("../models/user.model");
const { uploadToCloudinary } = require("../services/upload.service");
const {
  updateProfileImage,
  removeProfileImage,
} = require("../services/user.service");
const { Posts } = require("../models");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser({
    // _org: req.user._org,
    ...req.body,
  });
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name"]);
  console.log(filter);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, {
    ...options,
    // populate: [{
    //   path: "_org",
    //   select: "_id name email"
    // }]
  });
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  console.log(req.params.userId);
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const posts = await Posts.find({ createdBy: req.params.userId }).populate([
    { path: "createdBy", select: "_id name email firstName lastName" },
  ]);
  res.send({ user, posts: posts });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.user;
  const user = await userService.updateUserById(id, req.body);
  res.send(user);
});

const updateOrg = catchAsync(async (req, res) => {
  const org = await userService.updateOrgById(req.params.orgId, req.body);
  res.send(org);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const profileImage = async (req, res, next) => {
  let uploaded = await updateProfileImage(req.user._id, req.file.path, next);
  if (uploaded) {
    res.status(201).send({ success: true, massage: "image is uploaded" });
  }
};
const profileImageRemove = async (req, res, next) => {
  let uploaded = await removeProfileImage(req.user._id);
  if (uploaded) {
    res.status(201).send({ success: true, massage: "image is removed" });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateOrg,
  profileImage,
  profileImageRemove,
};
