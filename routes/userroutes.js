const Router = require("express").Router();
const userController = require("../controllers/usercontrollers.js");
const isAuth = require("../middelwares/authenticate.js");

// auth routes
Router.post("/register", userController.register);
Router.post("/login", userController.login);
Router.get("/logout", userController.logout);

// user routes
Router.get("/me", isAuth, userController.me);

Router.get("/:id", isAuth, userController.getById);
Router.put("/update", isAuth, userController.updateMyProfile);
Router.delete("/:id", isAuth, userController.remove);

// Additional user routes
Router.get("/search", isAuth, userController.search);
Router.post("/reset-password", isAuth, userController.resetPassword);
Router.put("/change-password", isAuth, userController.changePassword);
Router.put("/update-profile", isAuth, userController.updateProfile);

module.exports = Router;
