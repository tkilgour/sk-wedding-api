"use strict";
//import dependency
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an
//object that shows the shape of your database entries.
var PartiesSchema = new Schema({
	// _id: String,
	party_name: {
		type: String,
		required: true
	},
	party_slug: String,
	maxGuests: Number,
	potluck: Boolean,
	rsvp_opened: Boolean,
	rsvp_saved: Boolean,
	guests: [
		{
			first_name: String,
      last_name: String,
      attending: Boolean,
      camping: Boolean,
      breakfast: Boolean,
      dietary: String
		}
	]
});

//export our module to use in server.js
module.exports = mongoose.model("Party", PartiesSchema);
