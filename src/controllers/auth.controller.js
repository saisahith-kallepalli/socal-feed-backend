const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
//dsksdksk
const {
  authService,
  userService,
  tokenService,
  emailService,
  googleService,
} = require("../services");
const { setNewPassword } = require("../services/auth.service");
const User = require("../models/user.model");

const register = catchAsync(async (req, res) => {
  // const org = await userService.createOrg(req.body);
  let user;
  try {
    user = await userService.createUser({
      ...req.body,
      name: req.body.firstName + " " + req.body.lastName,
    });
  } catch (e) {
    // await org.remove();
    throw e;
  }
  user = await user.populate("name email");
  const { token, expires } = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({
    user,
    token,
    expires,
  });
});
const updatePassword = async (req, res, next) => {
  try {
    const setPassword = await setNewPassword(
      req.user.email,
      req.body.oldPassword,
      req.body.newPassword
    );
    if (setPassword) {
      res.status(201).send({ status: true, massage: "updated password" });
    } else {
      res
        .status(400)
        .send({ success: false, massage: "old password is invalid" });
    }
  } catch (error) {
    next(error);
  }
};
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const { token, expires } = await tokenService.generateAuthTokens(user);
  res.send({
    user,
    token,
    expires,
  });
});
const logout = catchAsync(async (req, res) => {
  await authService.logoutUser(req.user.email);
  res.status(httpStatus.NO_CONTENT).send();
});
// const logout = catchAsync(async (req, res) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader.split(" ")[1];
//   await tokenService.logoutToken(token, res);
// });
const googleLogin = catchAsync(async (req, res, next) => {
  const email = await googleService.googleAuth(req.body.idToken, next);
  const user = await authService.loginUserWithGoogle(email);
  const { token, expires } = await tokenService.generateAuthTokens(user);
  res.send({
    user,
    token,
    expires,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const self = catchAsync(async (req, res) => {
  const getSelf = await User.findById(req.user._id, {
    password: 0,
  }).populate("saved.id");
  res.send(getSelf);
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  googleLogin,
  updatePassword,
  logout,
  self,
};
