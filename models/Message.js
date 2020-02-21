let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let is = require('is_js');
mongoose.set('useFindAndModify', false);

const messageSchema = new Schema({
   senderId: String,
   receiverId: String,
   message: String
});

module.exports = mongoose.model('Message', messageSchema);