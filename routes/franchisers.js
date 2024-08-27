const express = require('express');
const Franchiser = require('../models/Franchiser');
const FranchiserMoney = require('../models/FranchiserMoney');
const Application = require('../models/Application');
const session = require('express-session');
const Grid = require('gridfs-stream');
const multer = require('multer');
const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');
const router = express.Router();
const { Readable } = require('stream');
const path = require('path');


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

  
// Franchiser Signup
router.post('/franchiserDetails', upload.single('file'), async (req, res) => {
    try {
      const { username, email, password, businessType, numberOfFranchises, avgTurnover, hqAddress, avgStock, avgPricePerMonth, franchiserCoins } = req.body;
  
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
  
        let franchiser = new Franchiser({
          username: username,
          email: email,
          password: password,
          businessType: businessType,
          numberOfFranchises: numberOfFranchises,
          avgTurnover: avgTurnover,
          hqAddress: hqAddress,
          avgStock: avgStock,
          avgPricePerMonth: avgPricePerMonth,
          fileId: fileId,
          franchiserCoins: franchiserCoins,
        });
        try{
          await franchiser.save();
          req.session.franchiser = franchiser;
          res.json('Signup Success');
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        }
       
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
router.post('/validateFranchiser',async (req,res)=>{
    const {username,password} = req.body;
    let franchiser = await Franchiser.findOne({username:username,password:password});
    if(franchiser){
        req.session.franchiser = franchiser;
        console.log(req.session.franchiser);
        res.json('signin success');
    }else{
        res.json('signin failed');
    }
});

router.get('/franchiserDetails',async (req,res)=>{
    try{
        const franchisers = await Franchiser.find({},'-password');
        res.json(franchisers);
    }catch(err){
        res.json({error:'Error Occured'});
    }
});

router.get('/mostPopularFranchisers',async (req,res)=>{
    try{
        const topFranchises = await Franchiser.find({}, '-password')
      .sort({ numberOfFranchises: -1, franchiserCoins: -1 })
      .limit(10);

    res.json(topFranchises);
    }catch(err){
        res.json({error:'Error Occured'});
    }
});


async function updateOrInsertFranchiserMoney(username, amount) {
    try {
      const existingFranchiser = await FranchiserMoney.findOne({ username });
  
      if (existingFranchiser) {
        // Update existing Franchiser's money
        existingFranchiser.money += amount;
        await existingFranchiser.save();
        return existingFranchiser;
      } else {
        // Create a new Franchiser with the given username and money
        const newFranchiser = new FranchiserMoney({ username:username, money: amount });
        await newFranchiser.save();
        return newFranchiser;
      }
    } catch (error) {
      console.error('Error updating or inserting Franchiser money:', error);
    }
  }

//Add or reduce money
router.post('/updateWalletMoney',async (req,res)=>{
    const {username,amount} = req.body;
    const d = await updateOrInsertFranchiserMoney(username,amount);
    res.json(d);
});

router.get('/franchiserMoney/:id',async (req,res)=>{
    const Franchisermoney = await FranchiserMoney.findOne({username:req.params.id});
    console.log(Franchisermoney);
    if(Franchisermoney){
    res.json(Franchisermoney.money);
    }else{
        res.json(0);
    }
});

router.get('/file/:fileId', async (req, res) => {
    try {
      const fileId = new mongoose.Types.ObjectId(req.params.fileId);
  
      const downloadStream = gfsBucket.openDownloadStream(fileId);
  
      downloadStream.on('data', (chunk) => {
        res.write(chunk);
      });
  
      downloadStream.on('error', (err) => {
        console.error('Error downloading file:', err);
        res.status(404).json({ error: 'File not found' });
      });
  
      downloadStream.on('end', () => {
        res.end();
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/franchiserSessionDetails',(req,res)=>{
    if(req.session.franchiser){
        setTimeout(()=>{
            res.json(req.session.franchiser);
        },1000);
       
    }else{
        res.json('Unauthorized');
    }
});

//Revoke a Franchise 
router.post('/revokeApplication',async (req,res)=>{

  try{
  const filter = req.body;
  const update = {
      approved:-2
  };

  console.log('filter'+filter);

  const result = await Application.findOneAndUpdate(filter, update);

  if(result){
  res.json('Revoke Successful');
  }else{
    res.json('Revoke Unsuccessful');
  }
  }catch(err){

    console.log('Error Occured');
      res.json(err);
  }

});

router.get('/Franchiser',async (req,res)=>{
  if(req.session.franchiser){
    res.sendFile(path.join(__dirname, '../public/Franchiser','CardF.html'));
  }else{
    res.json("Unauthorised");
  }

});

module.exports = router;


