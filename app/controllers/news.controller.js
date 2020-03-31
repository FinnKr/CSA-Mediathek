const db = require("../models");
const News = db.news;
const Op = db.Sequelize.Op;

// Retrieve all news
exports.findAll = (req, res) => {
    News.findAll({ where: {} })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving news."
            });
        });
};

// Create and Save a new News message
exports.create = (req, res) => {
    // Validate request
    if (!req.body.message) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create news
    const news = {
        message: req.body.message
    }

    // Save News in database
    News.create(news)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some internal error occured while creating news entry"
            });
        });
};