module.exports = app => {
    const news = require("../controllers/news.controller.js");

    var router = require("express").Router();

    // Retrieve all news
    router.get("/", news.findAll);

    // Create news
    router.post("/", news.create);

    app.use("/news", router);
};