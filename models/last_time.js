module.exports = (sequelize, DataTypes) => {
    return sequelize.define('last_time', {
        id: {
            type: DataTypes.STRING(45),
            primaryKey: true,
        },
        time: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        streak: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        channel: {
            type: DataTypes.STRING(45),
            allowNull: false,
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    })
}