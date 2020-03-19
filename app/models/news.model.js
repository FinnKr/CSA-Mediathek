module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define("news", {
        message: {
            type: Sequelize.STRING
        }
    });

    return News;
};