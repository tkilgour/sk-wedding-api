require("dotenv").config();

//first we import our dependencies...
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PushBullet = require("pushbullet");
const Party = require("./party_schema");

//and create our instances
const app = express();
const router = express.Router();
const pusher = new PushBullet(process.env.PB_API_KEY);

//set our port to either a predetermined port number if you have set it up, or 3001
const port = process.env.API_PORT || 5001;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

//db config
mongoose.connect(
  `mongodb://${user}:${pass}@ds117888.mlab.com:17888/wedding-management`
);

//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  //and remove cacheing so we get the most recent parties
  res.setHeader("Cache-Control", "no-cache");
  next();
});

// simulate server latency
// app.use((req, res, next) => setTimeout(next, 1000));

// router
// .route("/")
// // retrieve all parties from db
// .get(function(req, res) {
//   Party.find(function(err, parties) {
//     if (err) res.send(err);
//     res.json(parties);
//   });
// });

router
  .route("/parties/:query")

  // get specific Party from DB
  .get(function(req, res) {
    Party.find(function(err, parties) {
      if (err) res.send(err);

      queriedParty = parties.filter(party => {
        return party.party_slug === req.params.query.toLowerCase();
      });

      // pusher.note(process.env.PB_PHONE_TOKEN, `"${queriedParty[0].party_name}" visited their RSVP page`, 'test', (err, res) => console.log(res));

      res.json(queriedParty);
    });
  });

router
  .route("/parties/:party_id")
  // update specific Party in DB
  .put(function(req, res) {
    Party.findById(req.params.party_id, function(err, party) {
      if (err) res.send(err);

      req.body.guests ? (party.guests = req.body.guests) : null;
      party.potluck = req.body.potluck;
      party.rsvp_saved = true;

      party.save(function(err) {
        if (err) res.send(err);

        res.json({ saved: true });
      });
    });
  });

//Use our router configuration when we call /api
app.use("/api", router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
