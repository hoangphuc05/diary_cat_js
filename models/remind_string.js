
export default (sequelize, DataTypes) => {
    return sequelize.define('remind_string', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        enable:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        }
    },{
        timestamps: false,
        freezeTableName: true,
    });
}