const sequelize = require("../config/db");

// Import all models
const User = require("./User");
const Staff = require("./Staff");
const Service = require("./Service");
const StaffService = require("./StaffService");
const WorkingHour = require("./WorkingHour");
const Appointment = require("./Appointment");
const Payment = require("./Payment");
const Review = require("./Review");
const Invoice = require("./Invoice");

//  STAFF <-> SERVICE
// Many-to-Many

Staff.belongsToMany(Service, {
  through: StaffService,
  as: "services",
  foreignKey: "staffId",
  otherKey: "serviceId",
});

Service.belongsToMany(Staff, {
  through: StaffService,
  foreignKey: "serviceId",
  otherKey: "staffId",
  as: "staff",
});

// STAFF <-> WORKING HOURS
// One Staff -> Many Working Hours

Staff.hasMany(WorkingHour, {
  foreignKey: "staffId",
  as: "workingHours",
  onDelete: "CASCADE",
});

WorkingHour.belongsTo(Staff, {
  foreignKey: "staffId",
  as: "staff",
});

// USER <-> APPOINTMENT
// One User -> Many Appointments

User.hasMany(Appointment, {
  foreignKey: "userId",
  as: "appointments",
  onDelete: "CASCADE",
});

Appointment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// STAFF <-> APPOINTMENT
// One Staff -> Many Appointments

Staff.hasMany(Appointment, {
  foreignKey: "staffId",
  as: "appointments",
  onDelete: "CASCADE",
});

Appointment.belongsTo(Staff, {
  foreignKey: "staffId",
  as: "staff",
});

// SERVICE <-> APPOINTMENT
// One Service -> Many Appointments

Service.hasMany(Appointment, {
  foreignKey: "serviceId",
  as: "appointments",
  onDelete: "RESTRICT",
});

Appointment.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
});

// APPOINTMENT <-> PAYMENT
// One Appointment -> Many Payments

Appointment.hasMany(Payment, {
  foreignKey: "appointmentId",
  as: "payments",
  onDelete: "CASCADE",
});

Payment.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointment",
});

//  USER <-> PAYMENT
// One User -> Many Payments

User.hasMany(Payment, {
  foreignKey: "userId",
  as: "payments",
  onDelete: "CASCADE",
});

Payment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// APPOINTMENT <-> REVIEW
// One Appointment -> One Review

Appointment.hasOne(Review, {
  foreignKey: "appointmentId",
  as: "review",
  onDelete: "CASCADE",
});

Review.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointment",
});

// USER <-> REVIEW
// One User -> Many Reviews

User.hasMany(Review, {
  foreignKey: "userId",
  as: "reviews",
  onDelete: "CASCADE",
});

Review.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// STAFF <-> REVIEW
// One Staff -> Many Reviews

Staff.hasMany(Review, {
  foreignKey: "staffId",
  as: "reviews",
  onDelete: "CASCADE",
});

Review.belongsTo(Staff, {
  foreignKey: "staffId",
  as: "staff",
});

// SERVICE <-> REVIEW
// One Service -> Many Reviews

Service.hasMany(Review, {
  foreignKey: "serviceId",
  as: "reviews",
  onDelete: "CASCADE",
});

Review.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
});

//  APPOINTMENT <-> INVOICE
// One Appointment -> One Invoice

Appointment.hasOne(Invoice, {
  foreignKey: "appointmentId",
  as: "invoice",
  onDelete: "CASCADE",
});

Invoice.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointment",
});

// EXPORT

module.exports = {
  sequelize,

  User,
  Staff,
  Service,
  StaffService,
  WorkingHour,
  Appointment,
  Payment,
  Review,
  Invoice,
};
