const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Resource = require('./Resource');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Resource,
      key: 'id',
    },
  },
  requested_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Confirmed',
  },
}, {
  tableName: 'bookings',
  timestamps: true,
});

// One-to-Many relationship
Resource.hasMany(Booking, { foreignKey: 'resource_id' });
Booking.belongsTo(Resource, { foreignKey: 'resource_id' });

module.exports = Booking;
