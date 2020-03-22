const db = require("../models");
const bcyrpt =require("bcrypt");
const jwt = require("jsonwebtoken");
const User = db.users;
const Op = db.Sequelize.Op;
const JWT_KEY = "4376/&fhj3/fbh";

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.mail || !req.body.password) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    User.findAll({ where: { mail: req.body.mail }})
        .then(data => {
            if (data.length >= 1) {
                res.status(422).send({
                    message: "Mail already exists!"
                });
            } else {
                bcyrpt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).send({
                            message: err || "Some internal error occured while hashing the password"
                        });
                    } else {
                        // Create a User
                        const user = {
                            name: req.body.name,
                            mail: req.body.mail,
                            password: hash
                        }

                        // Save User in database
                        User.create(user)
                        .then(data => {
                            res.status(201).send(data);
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || "Some internal error occured while creating the User"
                            });
                        });
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some internal error occured while checking the given Mail"
            });
        });
};

// Retrieve all Users with "name" from the database
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    User.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving users."
            });
        });
};

// Find a single User by id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving User with id=" + id
            });
        });
};

// Update a User by id
exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe the User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a User by id
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

// Delete all Users from the database
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Users were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while removing all users."
            });
        });
};

// Login to user
exports.login = (req, res) => {
    User.findAll({ where: { mail: req.body.mail }})
        .then(data => {
            if (data.length < 1) {
                res.status(401).send({
                    message: "Auth failed"
                });
            } else {
                bcyrpt.compare(req.body.password, data[0].password, (err, result) => {
                    if (err) {
                        res.status(401).send({
                            message: "Auth failed"
                        });
                    } else {
                        if (result) {
                            const token = jwt.sign(
                                {
                                    mail: data[0].mail,
                                    userId: data[0].id
                                },
                                JWT_KEY,
                                {
                                    expiresIn: "1h"
                                }
                            );
                            res.status(200).send({
                                message: "Auth successful",
                                token: token
                            });
                        } else {
                            res.status(401).send({
                                message: "Auth failed"
                            });
                        }
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some internal error occured"
            })
        });
};