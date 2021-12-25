export default (sequelize, DataTypes) => {
    return sequelize.define('reminder', {
        id: {
            type: DataTypes.STRING(45),
            primaryKey: true,
        },
        reminded: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        remind_switch: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },{
        timestamps: false,
        freezeTableName: true,

    });
}