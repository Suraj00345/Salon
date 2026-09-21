const Service = require("../models/Service");
//create service
const createService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    if (!name || !duration || price === undefined) {
      return res.status(400).json({
        success: "false",
        message: "Name, duration and price are required",
      });
    }
    const service = await Service.create({
      name,
      description,
      duration,
      price,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Service is created successfully",
      service,
    });
  } catch (error) {
    console.error("Create Service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

//get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: {
        isActive: true,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Create Service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

//get services by id
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

//update service
const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: "false",
        message: "Service not found",
      });
    }

    const { name, description, duration, price, isActive } = req.body;

    await service.update({
      name: name ?? service.name,
      description: description ?? service.description,
      duration: duration ?? service.duration,
      price: price ?? service.price,
      isActive: isActive ?? service.isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

//delete service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.update({
      isActive: false,
    });

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
