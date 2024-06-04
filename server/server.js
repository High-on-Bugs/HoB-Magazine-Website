// server.js is a proxy for the react app
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const bodyParser = require('body-parser');
require('dotenv').config();

// Server
const app = express();
app.use(cors({
  methods: ['GET', 'POST'],
}));
app.use(bodyParser.json());

// mongodb connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

const Email = require('./models/emails');

app.get("/", (req, res) => {
  res.send("Proxy Server Live!");
});

// oauth route
app.get("/getAccessToken", async (req, res) => {
  const params = "?client_id=" + process.env.GITHUB_CLIENT_ID + "&client_secret=" + process.env.GITHUB_CLIENT_SECRET + "&code=" + req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      "Accept": "application/json"
    }
  }).then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

// get user data route
app.get("/getUserData", async (req, res) => {

  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      "Authorization": req.get("Authorization")
    }
  }).then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
});

// email route (get and post)

app.get("/emails", async (req, res) => {
  try {
    // send just a list of all emails using pipeline
    const emails = await Email.aggregate([
      {
        $group: {
          _id: 200,
          emails: {
            $push: "$email"
          }
        }
      }
    ]);
    res.json(emails);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/email", async (req, res) => {
  const email = new Email({
    email: req.body.email
  });

  try {
    const newEmail = await email.save();
    res.status(201).send({
      message: "Email added successfully",
      data: newEmail
    })
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
