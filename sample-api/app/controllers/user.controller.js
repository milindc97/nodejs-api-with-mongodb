const config = require("../config/auth.config");
const db = require("../models");
const {
  user: User
} = db;

const mongooseErrorHandler = require('mongoose-validation-error-message-handler');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


// Signup
exports.signup = (req, res) => {

  req.body.password = bcrypt.hashSync(req.body.password,8);

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      const error = mongooseErrorHandler(err);
      console.log(error);
      res.status(error.status || 500);
      res.json({error:{status:"error" ,message: error.message }});
    }
    if (err) {
      res.status(500).send({
        error: {
          status: "error",
          message: err
        }
      });
      return;
    }

    if (req.body.role) {
      user.save(err => {
        if (err) {
          res.status(500).send({
            error: {
              status: "error",
              message: err
            }
          });
          return;
        }

        res.send({
          status: 'success',
          message: "User was registered successfully!"
        });
      });
    } else {
      user.role = "user";
      user.save(err => {
        if (err) {
          res.status(500).send({
            error: {
              status: "error",
              message: err
            }
          });
          return;
        }

        res.send({
          status: 'success',
          message: "User was registered successfully!"
        });
      });
    }
  });
};


// Login
exports.login = (req, res) => {
  if (req.body.email == "" || req.body.email == undefined) {
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }

  if (req.body.password == "" || req.body.password == undefined) {
    return res.status(401).send({
      accessToken: null,
      message: "Missing Data",
    });
  }
  User.findOne({
      email: req.body.email
    })
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({
          error: {
            status: "error",
            message: err
          }
        });
        return;
      }

      if (!user) {
        return res.status(500).send({
          error: {
            status: "error",
            message: "User Not found."
          }
        });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = jwt.sign({
        id: user.id
      }, config.secret, {
        expiresIn: config.jwtExpiration,
      });


      User.findByIdAndUpdate(user._id, {
        $set: {
          lastLoginOn: new Date()
        }
      }, (err, data) => {
        if (err) {
          console.log(err);
        }

      });

      res.status(200).send({
        status: "success",
        message: "Login successfully",
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          accessToken: token,
          lastLoginOn: user.lastLoginOn
        }
      });
    });
};

// Get User
exports.getUser = async(req, res) => {
  let user = await User.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        error: {
          status: "error",
          message: err
        }
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "Single User retrieved",
        data: data
      });
    }
  });
}

// Delete User
exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        error: {
          status: "error",
          message: err
        }
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "User Successfully Deleted"
      });
    }
  });
}

// Patch User
exports.patchUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body.data, (err, data) => {
    if (err) {
      res.status(500).send({
        error: {
          status: "error",
          message: err
        }
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "User Successfully Updated"
      });
    }
  });
}

 