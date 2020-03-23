module.exports = app => {
    const news = require("../controllers/news.controller.js");
    const checkAuth = require("../middleware/check-auth.js");

    var router = require("express").Router();

    // Retrieve all news
    router.get("/", news.findAll);

    // Create news
    router.post("/", checkAuth, news.create);

    app.use("/news", router);
};