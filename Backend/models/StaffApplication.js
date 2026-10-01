const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const StaffApplication = sequelize.define(
  "StaffApplication",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    experience: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    qualification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    skills: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    requestedServices: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },

    adminNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "staff_applications",
    timestamps: true,
  },
);

module.exports = StaffApplication;
