const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatroomSchema = new Schema(
  {
    // roomId:{type:"String",required:true},
    chats: [
      {
        id: { type: Schema.Types.ObjectId, ref: "chat" },
        deleted: { type: Boolean, default: false },
      },
    ],
    users: [
      {
        id: { type: Schema.Types.ObjectId, ref: "User" },
        deleted: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("chatroom", chatroomSchema);
