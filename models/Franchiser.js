const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const franchiserSchema = new Schema({
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
    businessType: {
        type: String,
        required: true
    },
    numberOfFranchises: {
        type: Number,
        required: true
    },
    avgTurnover: {
        type: Number,
        required: true
    },
    hqAddress: {
        type: String,
        required: true
    },
    avgStock: {
        type: Number,
        required: true
    },
    avgPricePerMonth: {
        type: Number,
        required: true
    },
    fileId: { // Reference to the file stored in GridFS
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    franchiserCoins: {
        type: Number,
        required: true
    }
});
  
const Franchiser = mongoose.model('Franchiser', franchiserSchema);
  
module.exports = Franchiser; 