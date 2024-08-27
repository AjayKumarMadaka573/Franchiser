const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const dailyRevenueUpdatesSchema = new Schema({
   franchiserUsername:{
    type:String,
    required:true
   },
   data:{
    type:Array
   }
});
  
const DailyRevenueUpdate = mongoose.model('DailyRevenueUpdate', dailyRevenueUpdatesSchema);
  
module.exports = DailyRevenueUpdate; 