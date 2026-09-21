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

// 1. Staff <-> Service (Many-to-Many)
Staff.belongsToMany(Service, {
  through: StaffService,
  foreignKey: "staffId",
  otherKey: "serviceId",
});
Service.belongsToMany(Staff, {
  through: StaffService,
  foreignKey: "serviceId",
  otherKey: "staffId",
});

// 2. Staff <-> WorkingHour (One-to-Many)
Staff.hasMany(WorkingHour, { foreignKey: "staffId" });
WorkingHour.belongsTo(Staff, { foreignKey: "staffId" });

// 3. Appointment Relationships
User.hasMany(Appointment, { foreignKey: "userId" });
Appointment.belongsTo(User, { foreignKey: "userId" });

Staff.hasMany(Appointment, { foreignKey: "staffId" });
Appointment.belongsTo(Staff, { foreignKey: "staffId" });

Service.hasMany(Appointment, { foreignKey: "serviceId" });
Appointment.belongsTo(Service, { foreignKey: "serviceId" });

// 4. Payment Relationships
Appointment.hasMany(Payment, { foreignKey: "appointmentId" });
Payment.belongsTo(Appointment, { foreignKey: "appointmentId" });

User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

// 5. Review Relationships
Appointment.hasOne(Review, { foreignKey: "appointmentId" });
Review.belongsTo(Appointment, { foreignKey: "appointmentId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

Staff.hasMany(Review, { foreignKey: "staffId" });
Review.belongsTo(Staff, { foreignKey: "staffId" });

Service.hasMany(Review, { foreignKey: "serviceId" });
Review.belongsTo(Service, { foreignKey: "serviceId" });

// 6. Invoice Relationships
Appointment.hasOne(Invoice, { foreignKey: "appointmentId" });
Invoice.belongsTo(Appointment, { foreignKey: "appointmentId" });

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
