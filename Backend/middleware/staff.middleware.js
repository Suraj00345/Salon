
export const isStaff = (req, res, next) => {
  if (req.user?.role !== "staff" && req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access Denied. Professional account required.",
    });
  }
  next();
};
