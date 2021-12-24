

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('daily_entry', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        author: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT('medium'),
            allowNull: true,
        },
        url: {
            type: DataTypes.TEXT('medium'),
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: true,
        }
    },{
        timestamps: false,
        freezeTableName: true,

    })
}