module.exports = (sequelize, Sequelize) => {
    const Userlibary = sequelize.define("userlibary", {
        userid: {
            type: Sequelize.INTEGER
        },
        shopentryid :{
            type: Sequelize.INTEGER
        }
    });

    return Userlibary;
};