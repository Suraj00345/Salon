const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Working_hour = sequelize.define(
  "Working_hour",
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
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 6,
      },
    },
    startTime: {
      type: DataTypes.TIME, // Stores time in 'HH:MM:SS' format
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME, // Stores time in 'HH:MM:SS' format
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "working_hours",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["staffId", "dayOfWeek"], 
      },
    ],
  },
);

module.exports = Working_hour;
