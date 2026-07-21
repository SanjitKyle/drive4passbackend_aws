const InstructorAvailability = require("../../models/DS/weekly_availability");

// Create or Update Availability
exports.createOrUpdateAvailability = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { weeklyAvailability } = req.body;

    let availability = await InstructorAvailability.findOne({ instructorId });

    if (availability) {
      // Update existing
      availability.weeklyAvailability = weeklyAvailability;
      availability.lastUpdated = new Date();
      await availability.save();
      return res.status(200).json({ message: "Availability updated", availability });
    } else {
      // Create new
      availability = new InstructorAvailability({
        instructorId,
        weeklyAvailability
      });
      await availability.save();
      return res.status(201).json({ message: "Availability created", availability });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Instructor Availability
exports.getAvailability = async (req, res) => {
  try {
    const { instructorId } = req.params;
        const school_id=req.user.school_id;

    const availability = await InstructorAvailability.findOne({ instructorId ,school_id});

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json({ availability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
