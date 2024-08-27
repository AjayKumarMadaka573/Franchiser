const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const dealerMoneySchema = new Schema({
  username:{
    type:String,
    required:true
   },
   money:{
    type:Number,
    required:true
   }
});
  
const DealerMoney = mongoose.model('DealerMoney', dealerMoneySchema);
  
module.exports = DealerMoney; 