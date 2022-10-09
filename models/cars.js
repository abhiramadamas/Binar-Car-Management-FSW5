module.exports = (sequelize, DataTypes) => {
    const Cars = sequelize.define('Cars', {
        id: {
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true
        },
            nama: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        sewa: {
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        ukuran: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        img: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE, 
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE, 
            allowNull: false
        }
    }, 
    {
        tableName: 'cars',
    });
    // Cars.associate = function(models) {
    //     // associations can be defined here
    // };
    return Cars;
}