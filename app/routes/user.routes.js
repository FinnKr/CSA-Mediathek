module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const userlibentries = require("../controllers/userlibary.controller.js");
    const checkAuth = require("../middleware/check-auth.js");

    var router = require("express").Router();

    // Create a new User
    router.post("/", users.create);

    // Retrieve all users with "name"
    router.get("/", checkAuth, users.findAll);

    // Retrieve a single User with id
    router.get("/:id(\\d{0,})", checkAuth, users.findOne);

    // Update a User with id
    router.put("/:id", checkAuth, users.update);

    // Delete a User with id
    router.delete("/:id", checkAuth, users.delete);

    // Delete all users
    router.delete("/", checkAuth, users.deleteAll);

    // Login to existing user
    router.post("/login", users.login);

    // Create and Save a new Userlibaryentry
    router.post("/libary/buy/:id", checkAuth, userlibentries.create);

    // Retrieve all userlibaryentries with "name"
    router.get("/libary", checkAuth, userlibentries.findAll);

    // Find a single Userlibaryentry by id
    router.get("/libary/:id", checkAuth, userlibentries.findOne);

    app.use("/user", router);
};