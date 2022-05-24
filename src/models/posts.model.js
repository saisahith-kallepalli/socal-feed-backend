const mongoose = require("mongoose");
const paginate = require("./plugins/paginate.plugin");
const Schema = mongoose.Schema;
const feedSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    image: { type: Array, required: true },
    caption: { type: String, required: false },
    likes: [{ id: { type: Schema.Types.ObjectId, ref: "comments" } }],
    saved: [{ id: { type: Schema.Types.ObjectId, ref: "User" } }],
  },
  { timestamps: true }
);
feedSchema.plugin(paginate);

const Posts = mongoose.model("post", feedSchema);
module.exports = Posts;
