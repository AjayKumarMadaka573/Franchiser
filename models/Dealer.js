const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const dealerSchema = new Schema({
    username: {
        type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    fileId: { // Reference to the file stored in GridFS
      type: Schema.Types.ObjectId,
      ref: 'File'
  },
    dealerCoins: {
      type: Number,
      required: true
    }
});
  
const Dealer = mongoose.model('Dealer', dealerSchema);
  
module.exports = Dealer; 