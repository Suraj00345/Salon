const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Invoice = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // One invoice per appointment
      references: { model: "appointments", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "invoices",
    timestamps: true,
  }
);

module.exports = Invoice;