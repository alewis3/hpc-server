var express = require('express');
var router = express.Router();
const is = require("is_js");
let User = require('../models/User');
let Message = require('../models/Message');

/**
 * POST send message
 *
 * See https://hpcompost.com/api/docs#api-Messages-PostMessage for more info
 */
router.post('/', async function(req, res) {
   var body = req.body;

   // check if the ids exist
   if (is.not.existy(body.senderId)) {
      return res.status(400).send({success: false, error: "SenderIdMissing"});
   }
   if (is.not.existy(body.receiverId)) {
      return res.status(400).send({success: false, error: "ReceiverIdMissing"});
   }

   // check that the ids are not the same
   if (body.senderId === body.receiverId) {
      return res.status(400).send({success: false, error: "A user cannot message thyself"});
   }

   // grab each user
   let sender = await User.findById(body.senderId).exec();
   let receiver = await User.findById(body.receiverId).exec();

   // check that each user is not null
   if (!sender) {
      return res.status(400).send({success: false, error: "SenderIdNotFound"});
   }
   if (!receiver) {
      return res.status(400).send({success: false, error: "ReceiverIdNotFound"});
   }

   // check that the sender's messagingWith array contains the receiver id
   if (!sender.messagingWith.includes(body.receiverId)) {
      sender.messagingWith.push(body.receiverId);
      await sender.save();
   }

   // check that the receiver's messagingWith array contains the sender id
   if (!receiver.messagingWith.includes(body.senderId)) {
      receiver.messagingWith.push(body.senderId);
      await receiver.save();
   }

   // update the sender id's messagingWith array to have the receiver id first
   await User.findByIdAndUpdate(body.senderId, {
      $push: {
         messagingWith: {
            $each: [body.receiverId],
            $position: 0
         }
      }
   }).exec(function (err) {
      if (err) return res.status(500).send({success: false, error: err});
   });

   // update the receiver id's messagingWith array to have the sender id first (for loading conversations)
   await User.findByIdAndUpdate(body.receiverId, {
      $push: {
         messagingWith: {
            $each: [body.senderId],
            $position: 0
         }
      }
   }).exec(function (err) {
      if (err) return res.status(500).send({success: false, error: err});
   });

   var message = new Message({
      senderId: body.senderId,
      receiverId: body.receiverId,
      message: body.message
   });
   await message.save(function (err) {
      if (err) return res.status(500).send({success: false, error: err});
      else return res.status(201).send({success: true});
   });
});

/**
 * Get a conversation
 *
 * See https://hpcompost.com/api/docs#api-Messages-GetConversation for more info
 */
router.get('/conversation', async function(req, res) {
   const query = req.query;
   const loggedInId = query.loggedInId;
   const otherId = query.otherId;

   await Message.find({$or: [{senderId: loggedInId, receiverId: otherId}, {senderId: otherId, receiverId: loggedInId}]}).select({sentAt: -1}).exec(function (err, messages) {
      if (err) return res.status(500).send({success: false, error: err});
      else return res.status(200).send({success: true, messages: messages});
   });
});

/**
 * Get all conversations
 *
 * See https://hpcompost.com/api/docs#api-Messages-GetConversations for more info
 */
router.get('/conversations', async function (req, res) {
   const id = req.query.id;
   const user = await User.findById(id).exec();
   const messagingWithArr = user.messagingWith;
   if (messagingWithArr.length === 0) {
      return res.status(204).send({success: true, conversations: []})
   }
   const userConvoInfo = messagingWithArr.map(async function(id) {
      return await User.findById(id).select("email name").exec();
   });
   if (!userConvoInfo) {
      return res.status(500).send({success: false, error: "No User Conversation Info"});
   }
   else {
      return res.status(200).send({success: true, conversations: userConvoInfo});
   }
})

module.exports = router;