// Import necessary modules and packages
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Budget = require('./models/budget.js');
const Purchases = require('./models/purchases.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const secret = process.env.SECRET_KEY;
const DB_URL = process.env.DB_URL;
const url = process.env.WEB_URL;

 
// Middleware to parse JSON data
const salt = bcrypt.genSaltSync(10);
app.use(cors({ credentials: true, origin: url  })); 
app.use(express.json()); 
app.use(cookieParser());


// Connect to MongoDB
mongoose.connect(DB_URL);

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { userName, password } = req.body;

  try { 
    // Create a new user document in the database
    const userDoc = await User.create({ 
      userName,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (err) {
    // Handle registration error
    res.status(400).json("Please Choose Different User Name");
  }
});  

// Route to handle user login
app.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  // Find the user document in the database
  const userDoc = await User.findOne({ userName });
  const passOkay = bcrypt.compareSync(password, userDoc.password);

  if (passOkay) {
    // Generate a JWT token and set it as a cookie
    jwt.sign({ userName, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token,{
       httpOnly: true,
       secure: true,
       sameSite: 'none'
      }).json({
        id: userDoc._id,
        userName,
      }); 
    });
  } else {
    // Handle incorrect credentials
    res.status(400).json('Wrong credentials');
  }
});

// Route to get user profile information
app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
 console.log(token)
  try {
    // Verify the JWT token
    const info = jwt.verify(token, secret);

    // Find the user document in the database
    const userDoc = await User.findOne({ userName: info.userName });

    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract needed fields and send user information along with budget data
    const { userName } = userDoc;
    res.json({ userName});
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}); 


// Route to handle user logout
app.post('/logout', (req, res) => {
  // Clear the token cookie
  res.cookie('token', '').json('Okay');
});

// Route to create a new budget
app.post('/budget', async (req, res) => { 
  const { token } = req.cookies;
  // Verify the JWT token and create a new budget document
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { incomes, expenses, amountLeft, totalIncome } = req.body;

    const postDoc = await Budget.create({
      incomes,
      expenses,
      totalIncome, 
      amountLeft,
      author: info.userName,
    }); 

    res.json(postDoc); 
  });
});

// Route to create a new purchase
app.post('/purchase', async (req, res) => {
  const { token } = req.cookies;

  // Verify the JWT token and create a new purchases document
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err; 

    const transactionLog = req.body;
    const postDoc = await Purchases.create({
      transactionLog,
      author: info.userName,
    });

    res.json(postDoc);
  }); 
});

// Route to update purchases with new transaction data
app.put('/purchase/:author', async (req, res) => {
  const { token } = req.cookies;
  const { author } = req.params;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const newTransaction = req.body;

    try {
      // Update the purchases document with new transaction data
      const filter = { author: author };
      const updateOperation = {
        $push: {
          transactionLog: newTransaction[newTransaction.length - 1],
        },
      };

      const updateResult = await Purchases.updateOne(filter, updateOperation);

      if (updateResult.matchedCount === 0) {
        return res.status(400).json('Document not found for the specified author');
      }

      res.json({ message: 'Document updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  }); 
});

// Route to get budget data for a specific author
app.get('/budget/:author', async (req, res) => {
  const { author } = req.params;

  try {
    // Find the budget document for the specified author
    const budgetDoc = await Budget.findOne({ author });
 
    if (!budgetDoc) {
      return res.status(200).json(false);
    }

    // Extract only the needed fields and send the simplified budget
    const { incomes, expenses, totalIncome, amountLeft, author: budgetAuthor } = budgetDoc;
    const simplifiedBudget = { incomes, expenses, totalIncome, amountLeft, author: budgetAuthor };

    res.json(simplifiedBudget);
  } catch (error) {
    console.error('Error fetching budget:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get purchases data for a specific author
app.get('/purchase/:author', async (req, res) => {
  const { author } = req.params;

  try {
    // Find the purchases document for the specified author
    const purchaseDoc = await Purchases.findOne({ author });

    if (!purchaseDoc || purchaseDoc == []) {
      res.json([]);
    } else {
      // Extract only the needed fields and send the transaction log
      const { transactionLog, author: budgetAuthor } = purchaseDoc;
      res.json(transactionLog);
    }
  } catch (error) {
    console.error('Error fetching purchases:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a budget and its purchases
app.delete('/budget/:userName', async (req, res) => {
  const { userName } = req.params;

  try {
    // Verify the JWT token
    const { token } = req.cookies;
    const info = jwt.verify(token, secret);

    // Check if the user making the request is the owner of the budget
    if (info.userName !== userName) {
      return res.status(403).json({ error: 'You do not have permission to delete this budget.' });
    }

    // Find and remove the budget for the specified user
    const deletedBudget = await Budget.findOneAndDelete({ author: userName });

    if (!deletedBudget) {
      return res.status(404).json({ error: 'Budget not found.' });
    }

    // Find and remove the purchases for the specified user
    const deletedPurchases = await Purchases.findOneAndDelete({ author: userName });

    if (!deletedPurchases) {
      return res.status(404).json({ error: 'Purchases not found.' });
    }

    res.json({ message: 'Budget and purchases deleted successfully.' });
  } catch (error) {
    console.error('Error deleting budget and purchases:', error.message);
    res.status(500).json({ error: 'Internal Server Error.' });
  } 
});

// Start the server
const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});         
