
// this act as a read receipt for the announcement
export default (sequelize, DataTypes) => {
    return sequelize.define('announcement_read', {
        user_id: {
            type: DataTypes.STRING(45),
            primaryKey: true,
        },
        announcement_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        }
    }, 
    {
        freezeTableName: true,
        timestamps: false,
    })
}