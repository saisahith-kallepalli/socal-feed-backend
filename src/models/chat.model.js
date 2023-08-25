const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    chatroomId: { type: Schema.Types.ObjectId, ref: "chatroom" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    messages: { text: { type: String, required: false },image:{type:String,required:false}},
    reply: { type: Schema.Types.ObjectId, ref: "chat" },
    hide:[ { type: Schema.Types.ObjectId, ref: "User" } ],

  },
  { timestamps: true }
);
module.exports = mongoose.model("chat", chatSchema);
