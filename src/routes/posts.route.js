const express = require("express");
const router = express.Router();
const postController = require("../controllers/posts.controller");
const auth = require("../middlewares/auth");
const { upload } = require("../middlewares/multerCloudnary");
const validate = require("../middlewares/validate");
const { createPost } = require("../validations/posts.validation");

router.use(auth());

router.get("/saved", postController.getSavePosts);
router
  .route("/")
  .post(upload.array("image", 50), postController.uploadPost)
  .get(postController.getAllPosts);
router.put("/update/:postId", postController.updatePostCaption);
router.delete("/delete/:postId", postController.deleteUploadedPost);
router.get("/self", postController.getUserPosts);
router.get("/:userId", postController.getUserIdPosts);
router
  .route("/like/:postId")
  .post(postController.likePost)
  .delete(postController.dislikePost);
router
  .route("/save/:postId")
  .post(postController.savePost)
  .delete(postController.unSavePost);

module.exports = router;
