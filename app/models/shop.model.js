module.exports = (sequelize, Sequelize) => {
    const Shopentry = sequelize.define("shopentry", {
        name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.FLOAT
        },
        description: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        }
    });

    return Shopentry;
};