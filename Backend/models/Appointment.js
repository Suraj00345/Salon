const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "staff", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "services", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    appointmentDate: {
      type: DataTypes.DATEONLY, // Stores 'YYYY-MM-DD'
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME, // Stores 'HH:MM:SS'
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME, // Stores 'HH:MM:SS'
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "paid", "refunded"),
      defaultValue: "unpaid",
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "appointments",
    timestamps: true,
  }
);

module.exports = Appointment;