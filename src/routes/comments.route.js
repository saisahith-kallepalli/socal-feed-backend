const express = require("express");
const auth = require("../middlewares/auth");
const commentController = require("../controllers/comments.controller");

const router = express.Router();

// Token authentication for all routes defined in this file
router.use(auth());

router
  .route("/post/:postId")
  .post(commentController.postComment)
  .get(commentController.getComments);
router.post("/comment/:postId/:commentId", commentController.replyComment);
router
  .route("/like/:commentId")
  .post(commentController.likeComment)
module.exports = router;
