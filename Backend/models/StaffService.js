const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Staff_services = sequelize.define(
  "Staff_services",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staffId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "staff",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "staff_services",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["staffId", "serviceId"],
      },
    ],
  },
);

module.exports = Staff_services;
