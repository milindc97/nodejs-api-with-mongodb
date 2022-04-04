const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({error:{ message: err }});
        return;
      }

      if (user) {
        res.status(500).send({error:{ status:"error" , message: "Failed! Email is already in use!" }});
        return;
      }

      next();
    });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;