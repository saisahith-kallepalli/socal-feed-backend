const { chatService } = require("../services");

const createOrJoinChatroom = async (req, res, next) => {
  console.log(req);
  const result = await chatService.createChatRoom(req.userId, req.personId);
  console.log(result);
};
module.exports = {
  createOrJoinChatroom,
};
