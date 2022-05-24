const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "post" },
    commentId: { type: Schema.Types.ObjectId, ref: "comments" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, required: true },
    reply: [{ id: { type: Schema.Types.ObjectId, ref: "comments" } }],
    likes: [{ id: { type: Schema.Types.ObjectId, ref: "comments" } }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("comments", commentSchema);
