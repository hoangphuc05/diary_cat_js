
// this define an announcement model
export default (sequelize, DataTypes) => {
    return sequelize.define('announcement', {
        id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        content: {
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        expire: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    })
}