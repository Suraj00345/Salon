const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Staff = sequelize.define(
  "Staff",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "staff",
    timestamps: true,
  },
);

module.exports = Staff;
