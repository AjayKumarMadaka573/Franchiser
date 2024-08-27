const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const franchiserMoneySchema = new Schema({
  username:{
    type:String,
    required:true
   },
   money:{
    type:Number,
    required:true
   }
});
  
const FranchiserMoney = mongoose.model('FranchiserMoney', franchiserMoneySchema);
  
module.exports = FranchiserMoney; 