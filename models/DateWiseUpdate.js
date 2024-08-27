const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const dateWiseUpdateSchema = new Schema({
   dealerUsername:{
    type:String,
    required:true
   },
   franchiserUsername:{
      type:String,
      required:true
   },
   date: {
    type: Date,
    required:true
   },
   revenue: {
    type: Number,
    required:true
   }
});
  
const DateWiseUpdate = mongoose.model('DateWiseUpdate', dateWiseUpdateSchema);
  
module.exports = DateWiseUpdate ; 