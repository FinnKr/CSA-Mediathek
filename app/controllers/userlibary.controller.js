const db = require("../models");
const jwt = require("jsonwebtoken");
const Userlibentry = db.userlibentries;
const Shopentry = db.shopentries;
const Op = db.Sequelize.Op;

// Create and Save a new Userlibaryentry
exports.create = (req, res) => {
    // Validate request
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Userlibaryentry
    const userlibentry = {
        userid: jwt.decode(req.headers.authorization.split(" ")[1]).userId,
        shopentryid: parseInt(req.params.id)
    }

    Userlibentry.findAll({ where: { [Op.and]: [{ userid: userlibentry.userid }, { shopentryid: userlibentry.shopentryid }] }})
        .then(data => {
            if (data.length >= 1) {
                res.status(422).send({
                    message: "Already in Userlibary"
                });
            } else {
                        // Save Userlibaryentry in database
                        Userlibentry.create(userlibentry)
                        .then(data => {
                            res.status(201).send(userlibentry);
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || "Some internal error occured while creating the Userlibaryentry"
                            });
                        });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some internal error occured while checking the given Mail"
            });
        });
};

// Retrieve all userlibaryentries with "name" from the database
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    console.log("name:" + name);

    

    Userlibentry.findAll({ where: {} })
        .then(userlibdata => {

            var userlibshopids = [];
            userlibdata.forEach(element => {
                userlibshopids.push(element.shopentryid);
            });

            Shopentry.findAll({ where: { [Op.and]: [ condition, { id: userlibshopids }] }})
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some internal error occured while retrieving shop entries."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving userlibaryentries"
            });
        });
};

// Find a single Userlibaryentry by id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Userlibentry.findAll({ where: { shopentryid: id } })
        .then(data => {
            if (data.length < 1) {
                res.status(404).send({
                    message: "Entry is not in Userlibary"
                });
            } else {
                Shopentry.findByPk(id)
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Some internal error occured while retrieving Userlibaryentry with id=" + id
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving userlibaryentry"
            })
        });


    
};