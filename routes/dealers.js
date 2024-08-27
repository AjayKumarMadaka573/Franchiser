const express = require('express');
const Dealer = require('../models/Dealer');
const Application = require('../models/Application');
const Franchiser = require('../models/Franchiser');
const DailyRevenueUpdate = require('../models/DailyRevenueUpdate');
const DateWiseUpdate = require('../models/DateWiseUpdate');
const DealerMoney = require('../models/DealerMoney');
const session = require('express-session');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
const Grid = require('gridfs-stream');
const multer = require('multer');
const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
dotenv.config();

const router = express.Router();

router.use(express.json());

let MONGO_URI = "mongodb+srv://AjayKumarMadaka:0WhDPq3qPMayV61i@cluster0.ohtfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Session
router.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  }));



// Create a connection
const conn = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
let gfsBucket;
  // Initialize GridFS Stream
  conn.once('open', () => {
    gfsBucket = new GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
  });
  
  
  const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory temporarily



// Dealer Signup
router.post('/dealerDetails',upload.single('file'),async (req,res)=>{
    try{
    const {username,email,password,dealerCoins} = req.body;

    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }


      // Convert buffer to stream
      const readableFileStream = new Readable();
      readableFileStream.push(req.file.buffer);
      readableFileStream.push(null); // End the stream
  
      // Upload file to GridFS
      const uploadStream = gfsBucket.openUploadStream(req.file.originalname);
      readableFileStream.pipe(uploadStream);
  
      uploadStream.on('error', (error) => {
        return res.status(500).json({ error: 'Error uploading file' });
      });
  
      uploadStream.on('finish', async () => {
        const fileId = uploadStream.id;
        console.log('File Id', fileId);
  
        try{
    let dealer = new Dealer({username,email,password,fileId,dealerCoins});
    await dealer.save();

    req.session.dealer = dealer;
    console.log(req.session.dealer);
    res.json('Signup Success');
        }catch(err){
            res.json(err);
        }

      });
    }catch(err){
        res.json(err);
    }

});

router.post('/validateDealer',async (req,res)=>{
    const {username,password} = req.body;
    let dealer = await Dealer.findOne({username:username,password:password});
    if(dealer){

        req.session.dealer = dealer;
        console.log(req.session.dealer);
        res.json('signin success');
 
    }else{
        res.json('signin failed');
    }
});

router.get('/dealerDetails',async (req,res)=>{
    try{
        const dealers = await Dealer.find({});
        res.json(dealers);
    }catch(err){
        res.json({error:'Error Occured'});
    }
});

router.get('/dealerSessionDetails',(req,res)=>{
    if(req.session.dealer){
        setTimeout(()=>{
            res.json(req.session.dealer);
        },3000);
       
    }else{
        res.json('Unauthorized');
    }
});


// Application 
router.post('/franchiseApplication',async (req,res)=>{
    try{
    const {franchiserUsername,dealerUsername,approved} = req.body;
    const startDate = new Date();
    const revenue = 0;
    let application = new Application({franchiserUsername,dealerUsername,approved,startDate,revenue});
    await application.save();

    res.json('Application Successfully Submitted');
    }catch(err){
        res.json(err);
    }

});

router.post('/collectApplicationfee',async (req,res)=>{

    try{
    const {filter , update} = req.body;

    const result = await Dealer.findOneAndUpdate(filter, update);

    req.session.dealer = await Dealer.findOne({_id:result._id});
    res.json('Update Successful');
    }catch(err){
        res.json(err);
    }

});


// Approving Application


router.post('/approveApplication',async (req,res)=>{

    try{
    const filter = req.body;
    const update = {
        approved:1
    };

    const result = await Application.updateOne(filter, update);

    res.json('Approval Successful');
    }catch(err){
        res.json(err);
    }

});


// Reject Application


router.post('/RejectApplication',async (req,res)=>{

    try{
    const filter = req.body;
    const update = {
        approved:-1
    };

    const result = await Application.updateOne(filter, update);

    res.json('Rejection Successful');
    }catch(err){
        res.json(err);
    }

});

router.get('/rejectedApplications/:id',async (req,res)=>{
    const result = await Application.find({dealerUsername:req.params.id,approved:-1});

    res.json(result);
});


// get Approved Franchises
router.post('/getApprovedFranchises',async (req,res)=>{
    try{
        const {username} = req.body;
        const approvedApplications = await Application.find({ dealerUsername:username, approved: 1 });

       
        // Group approved applications by franchiserUsername
        const groupedApplications = approvedApplications.reduce((acc, app) => {
          (acc[app.franchiserUsername] || (acc[app.franchiserUsername] = [])).push(app);
          return acc;
        }, {});
        
        // Find franchiser details for each franchiser
        const result = await Promise.all(Object.keys(groupedApplications).map(async (franchiserUsername) => {
          const franchiser = await Franchiser.findOne({ username: franchiserUsername }).select('-password');
          return {
            franchiser,
            applications: groupedApplications[franchiserUsername]
          };
        }));
        
     
       res.json(result);
    }catch(err){
        res.json(err);
    }
});


router.post('/getNotApprovedFranchises',async (req,res)=>{
    try{
        const {username} = req.body;
        const approvedApplications = await Application.find({ dealerUsername:username, approved: 0 });

       
        // Group approved applications by franchiserUsername
        const groupedApplications = approvedApplications.reduce((acc, app) => {
          (acc[app.franchiserUsername] || (acc[app.franchiserUsername] = [])).push(app);
          return acc;
        }, {});
        
        // Find franchiser details for each franchiser
        const result = await Promise.all(Object.keys(groupedApplications).map(async (franchiserUsername) => {
          const franchiser = await Franchiser.findOne({ username: franchiserUsername }).select('-password');
          return {
            franchiser,
            applications: groupedApplications[franchiserUsername]
          };
        }));
        
     
       res.json(result);
    }catch(err){
        res.json(err);
    }
});

async function updateOrInsertDailyRevenue(franchiserUsername, data) {
  try {
    const existingDocument = await DailyRevenueUpdate.findOne({ franchiserUsername });

    if (existingDocument) {

      existingDocument.data.push(data);
      await existingDocument.save();
    } else {
   
      const newDocument = new DailyRevenueUpdate({ franchiserUsername, data });
      await newDocument.save();
    }
  } catch (error) {
    console.error('Error updating or inserting daily revenue:', error);
  }
}

function addHours(dateString) {
    // Parse the input date string into a moment object
    const inputDate = moment(dateString);

    // Add 5.5 hours
    const newDate = inputDate.add(5.5, 'hours');

    return newDate.format(); // Return the new date in ISO 8601 format
}


// Update Revenue
router.post('/updateRevenue',async (req,res)=>{

    try{
    const {filter , update} = req.body;

    const find = await Application.findOne(filter);

    const result = await Application.findOneAndUpdate(filter, update);

    const result2 = new DateWiseUpdate({dealerUsername:result.dealerUsername,franchiserUsername:result.franchiserUsername,date:new Date(),revenue:update.revenue - find.revenue});

    result2.save();

    const today1 = moment().startOf('day');
    const today = addHours(today1);
    console.log(find);
    const dailyUpdate = {
            date : today,
            revenue : update.revenue - find.revenue
    };


    await updateOrInsertDailyRevenue(filter.franchiserUsername,dailyUpdate);

    const data = await Application.findOne({_id:result._id});
    res.json(data);
    }catch(err){
        res.json(err);
    }

});


function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate(); 
  
  }
  

router.post('/checkIfUpdatedToday',async (req,res)=>{
    const {dealerUsername,franchiserUsername} = req.body;

    const today = new Date();

    let updates = await DateWiseUpdate.find({dealerUsername:dealerUsername,franchiserUsername:franchiserUsername});

    let flag = false;
    updates.forEach(e=>{
        if(isSameDay(e.date,today)){
            flag = true;
        }
    });

    if(flag){
        res.json('Updated');
    }else{
        res.json('Not Updated');
    }
});


async function updateOrInsertDealerMoney(username, amount) {
    try {
      const existingDealer = await DealerMoney.findOne({ username });
  
      if (existingDealer) {
        // Update existing dealer's money
        existingDealer.money += amount;
        await existingDealer.save();
        return existingDealer;
      } else {
        // Create a new dealer with the given username and money
        const newDealer = new DealerMoney({ username:username, money: amount });
        await newDealer.save();
        return newDealer;
      }
    } catch (error) {
      console.error('Error updating or inserting dealer money:', error);
    }
  }

//Add or reduce money
router.post('/updateWalletMoney',async (req,res)=>{
    const {username,amount} = req.body;
    const d = await updateOrInsertDealerMoney(username,amount);
    res.json(d);
});

router.get('/dealerMoney/:id',async (req,res)=>{
    const dealermoney = await DealerMoney.findOne({username:req.params.id});
    console.log(dealermoney);
    if(dealermoney){
    res.json(dealermoney.money);
    }else{
        res.json(0);
    }
});


//Get Date wise details of revenue


router.post('/revenue-data', async (req, res) => {
    const { franchiserUsername } = req.body;

    try {
        const result = await DateWiseUpdate.aggregate([
            { $match: { franchiserUsername: franchiserUsername } },
            {
                $group: {
                    _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, dealerUsername: "$dealerUsername" },
                    revenue: { $sum: "$revenue" }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    dealers: {
                        $push: {
                            dealerUsername: "$_id.dealerUsername",
                            revenue: "$revenue"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    dealers: 1
                }
            },
            { $sort: { date: 1 } } // Optional: sort results by date
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Get Dealers
router.post('/FranchiseDealers', async (req, res) => {
    const { franchiserUsername } = req.body;

    if (!franchiserUsername) {
        return res.status(400).json({ message: 'franchiserUsername query parameter is required' });
    }

    try {
      
        const applications = await Application.find({
            franchiserUsername: franchiserUsername.toLowerCase(),
            approved: 1
        }).select('dealerUsername -_id'); 

        
        const dealerUsernames = applications.map(app => app.dealerUsername);

        if (dealerUsernames.length === 0) {
            return res.json([]); 
        }

        const dealers = await Dealer.find({ username: { $in: dealerUsernames } })
            .select('-password'); 

        res.json(dealers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/FranchiseAppliedDealers', async (req, res) => {
    const { franchiserUsername } = req.body;

    if (!franchiserUsername) {
        return res.status(400).json({ message: 'franchiserUsername query parameter is required' });
    }

    try {
      
        const applications = await Application.find({
            franchiserUsername: franchiserUsername.toLowerCase(),
            approved: 0
        }).select('dealerUsername -_id'); 

        
        const dealerUsernames = applications.map(app => app.dealerUsername);

        if (dealerUsernames.length === 0) {
            return res.json([]); 
        }

        const dealers = await Dealer.find({ username: { $in: dealerUsernames } })
            .select('-password'); 

        res.json(dealers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
