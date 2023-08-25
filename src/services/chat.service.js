const { Chat, Chatroom, User } = require("../models");

/**
 * Creates a new chat room between two users.
 *
 * @param {string} userId - The ID of the first user.
 * @param {string} personId - The ID of the second user.
 * @returns {Promise<Object>} The created chat room or existing one.
 */
const createChatRoom = async (userId, personId) => {
  // Check if chat room already exists between the users

  const chatRoomsExists = await Chatroom.find({
    "users.id": { $in: [userId, personId] },
  }).exec();

  if (chatRoomsExists.length === 0) {
    // Create a new chat room if it doesn't exist
    console.log("new");
    const newChatRoom = new Chatroom({
      users: [{ id: userId }, { id: personId }],
    });
    await newChatRoom.save();
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { chatrooms: newChatRoom._id } }
    );
    await User.findOneAndUpdate(
      { _id: personId },
      { $push: { chatrooms: newChatRoom._id } }
    );
    return newChatRoom;
  } else {
    console.log("old");
    // Return the first existing chat room
    try {
      await Chatroom.updateMany(
        {
          "users.id": { $in: [userId, personId] },
        },
        {
          $set: {
            "users.$[].deleted": false,
          },
        },
        { new: true }
      ).exec();
    } catch (error) {
      console.log(error);
    }
    return chatRoomsExists[0];
  }
};
/**
 * Deletes a chat room and updates related user information.
 *
 * @param {string} id - The ID of the chat room to be deleted.
 * @param {string} userId - The ID of the user performing the deletion.
 * @returns {Promise<void>} - A Promise that resolves when the deletion is complete.
 */
const deleteChatRoom = async (id, userId) => {
  // Update the chat room to mark the user as deleted
  await Chatroom.updateOne(
    { _id: id, "users.id": userId },
    { $set: { "users.$.deleted": true } }
  );

  // Remove the chat room ID from the user's chatrooms array
  await User.findOneAndUpdate({ _id: userId }, { $pull: { chatrooms: id } });

  // Add the chat room IDs to the user's hide array in Chat collection
  await Chat.updateMany({ chatroomId: id }, { $addToSet: { hide: "$_id" } });
};
/**
 * Retrieve all chats for a given room ID.
 *
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<Array>} - A promise that resolves to an array of room chats.
 */
const getChats = async (roomId) => {
  try {
    // Find all chats in the specified room
    const roomChats = await Chat.find({ roomId })
      // Populate the createdBy field with the user information
      .populate({ path: "createdBy", select: "_id name image" })
      // Sort the chats by createdAt field in descending order
      .sort({ createdAt: -1 });

    return roomChats;
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error retrieving chats:", error);
    throw error;
  }
};

/**
 * Creates a new chat in the chat room.
 *
 * @param {string} id - The ID of the chat room.
 * @param {string} userId - The ID of the user creating the chat.
 * @param {string} text - The text content of the chat message.
 * @param {string} image - The image URL of the chat message.
 * @param {string} chatId - The ID of the chat being replied to.
 */
const createChat = async (id, userId, text, image, chatId) => {
  // Create a new chat object
  const newChat = new Chat({
    chatroomId: id,
    createdBy: userId,
    message: { text: text, image: image },
    reply: chatId,
  });

  // Save the new chat object to the database
  await newChat.save();
};

module.exports = {
  getChats,
  createChat,
  createChatRoom,
  deleteChatRoom,
};
