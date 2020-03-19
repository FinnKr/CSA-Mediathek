const db = require("../models");
const Shopentry = db.shopentries;
const Op = db.Sequelize.Op;

// Create and Save a new shop entry
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.price || !req.body.description || !req.body.type) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a shop entry
    const shopentry = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        type: req.body.type
    }

    // Save shop entry in database
    Shopentry.create(shopentry)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some internal error occured while creating the shop entry"
            });
        });
};

// Retrieve all shop entries with "name" from the database
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Shopentry.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving shop entries."
            });
        });
};

// Find a single shop entry by id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Shopentry.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving shop entry with id=" + id
            });
        });
};