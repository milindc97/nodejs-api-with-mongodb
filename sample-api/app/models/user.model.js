const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default:"Active",
      enum:["Active","Inactive"]
    },
    lastLoginOn: {
      type: Date
    },
    stateUser: {
      type: String
    }
  }, {
    timestamps: true
  })
);

module.exports = User;