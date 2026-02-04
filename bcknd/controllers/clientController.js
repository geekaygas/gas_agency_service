const Client = require("../models/clientModel");

/**
 * @desc    Add new client
 * @route   POST /api/clients
 * @access  Public (can be protected later)
 */
exports.addClient = async (req, res) => {
  try {
    const {
      name,
      contactName,
      contactEmail,
      domains,
      emailProvider,
      renewalDate,
      domainCost,
      hostingCost,
    } = req.body;

    // 🔴 Validation
    if (!name || !contactName || !contactEmail || !domains) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const newClient = new Client({
      name,
      contact: {
        name: contactName,
        email: contactEmail,
      },
      domains,
      emailProvider,
      renewalDate,
      domainCost,
      hostingCost,
    });

    const savedClient = await newClient.save();

    res.status(201).json({
      success: true,
      message: "Client added successfully",
      data: savedClient,
    });
  } catch (error) {
    console.error("Add Client Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 📥 Get Clients WITH Pagination
exports.getClients = async (req, res) => {
  try {
    // 🔹 Query params
    const page = parseInt(req.query.page) || 1;   // current page
    const limit = parseInt(req.query.limit) || 10; // records per page
    const skip = (page - 1) * limit;

    // 🔹 Total records
    const totalClients = await Client.countDocuments();

    // 🔹 Fetch paginated data
    const clients = await Client.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: clients,
      pagination: {
        totalRecords: totalClients,
        currentPage: page,
        totalPages: Math.ceil(totalClients / limit),
        limit,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message, 
    });
  }
};


// ✏️ Update Client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        contact: {
          name: req.body.contactName,
          email: req.body.contactEmail,
        },
        domains: req.body.domains,
        emailProvider: req.body.emailProvider,
        renewalDate: req.body.renewalDate,
        domainCost: req.body.domainCost,
        hostingCost: req.body.hostingCost,
        status: req.body.status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// 🗑 Delete Client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
