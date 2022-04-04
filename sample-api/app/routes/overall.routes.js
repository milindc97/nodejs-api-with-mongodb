const userCtrl = require("../controllers/user.controller");
const { verifySignUp } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // User Controller
  app.post("/api/users/login", userCtrl.login);
  app.post("/api/users/signup", [verifySignUp.checkDuplicateUsernameOrEmail], userCtrl.signup);
  app.patch("/api/users/:id", userCtrl.patchUser);
  app.get("/api/users/:id", userCtrl.getUser);
  app.delete("/api/users/:id", userCtrl.deleteUser);
  
  

};

