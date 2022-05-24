const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const postsRoute = require("./posts.route");
const docsRoute = require("./docs.route");
const commentsRoute = require("./comments.route");
const config = require("../config/config");

const router = express.Router();

// Routes index
const defaultRoutes = [
  {
    path: "/auth", // base path for auth routes
    route: authRoute,
  },
  {
    path: "/users", // base path for user routes
    route: userRoute,
  },
  {
    path: "/posts", // base path for user routes
    route: postsRoute,
  },
  {
    path: "/comments", // base path for user routes
    route: commentsRoute,
  },
];

// Swagger documentation route available only in development mode
const devRoutes = [
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
