const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const Grid = require('gridfs-stream');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Route Paths
const dealerRoutes = require('./routes/dealers');
const franchiserRoutes = require('./routes/franchisers');
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public/Franchiser')));
// Routes
app.use('/api/dealers', dealerRoutes);
app.use('/api/franchisers',franchiserRoutes);

// Session
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  }));

let MONGO_URI = "mongodb+srv://AjayKumarMadaka:0WhDPq3qPMayV61i@cluster0.ohtfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    // Initialize GridFS
    const conn = mongoose.connection;
    conn.once('open', () => {
      console.log('MongoDB connection opened');
      const gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection('uploads'); // Collection name for files
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/TheFranchiser',async (req,res)=>{

  res.sendFile(path.join(__dirname, 'public','start.html'));
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  