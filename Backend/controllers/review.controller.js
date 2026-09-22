const { Review, Appointment, Service, Staff } = require("../models");


// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const { appointmentId, rating, comment } = req.body;

    if (!appointmentId || !rating) {
      return res.status(400).json({
        success: false,
        message: "appointmentId and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can review only completed appointments",
      });
    }

    const existingReview = await Review.findOne({
      where: {
        appointmentId,
        userId,
      },
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this appointment",
      });
    }

    const review = await Review.create({
      userId,
      appointmentId,
      serviceId: appointment.serviceId,
      staffId: appointment.staffId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
};

// GET SERVICE REVIEWS
const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: {
        serviceId: req.params.serviceId,
      },
      include: [
        {
          association: "user",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// UPDATE REVIEW
const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    await review.update({
      rating: rating ?? review.rating,
      comment: comment ?? review.comment,
    });

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await review.destroy();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// STAFF RESPONSE
const respondToReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const staff = await Staff.findByPk(req.user.staffId);

    if (!staff) {
      return res.status(403).json({
        success: false,
        message: "Only staff members can respond",
      });
    }

    if (review.staffId !== staff.id) {
      return res.status(403).json({
        success: false,
        message: "You cannot respond to this review",
      });
    }

    const { staffResponse } = req.body;

    if (!staffResponse) {
      return res.status(400).json({
        success: false,
        message: "Staff response is required",
      });
    }

    await review.update({
      staffResponse,
    });

    return res.status(200).json({
      success: true,
      message: "Response added successfully",
      review,
    });
  } catch (error) {
    console.error("Staff Response Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to respond to review",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getServiceReviews,
  updateReview,
  deleteReview,
  respondToReview,
};
