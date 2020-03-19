module.exports = app => {
    const shopentries = require("../controllers/shop.controller.js");

    var router = require("express").Router();

    // Create a new shop entry
    router.post("/", shopentries.create);

    // Retrieve all shop entries (with "name" [if Request-Query])
    router.get("/", shopentries.findAll);

    // Retrieve a single shop entry with id
    router.get("/:id", shopentries.findOne);

    app.use("/shop", router);
};