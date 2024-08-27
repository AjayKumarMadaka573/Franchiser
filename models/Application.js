const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const applicationSchema = new Schema({
    franchiserUsername: {
        type: String,
      required: true,
      lowercase: true,
    },
    dealerUsername: {
        type: String,
      required: true,
      lowercase: true,
    },
   approved: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required:true
    },
    revenue:{
      type:Number,
      required:0
    }
});
  
const Application = mongoose.model('Application', applicationSchema);
  
module.exports = Application; 