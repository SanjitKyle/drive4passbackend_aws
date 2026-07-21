const subareaModel = require("../../models/DS/subarea.model");

/**
 * Create Sub Area
 */
exports.createSubArea = async (req, res) => {
    try {
        const { name, area, postcode, status } = req.body;

        const rs = await subareaModel.create({
            name,
            area,
            postcode,
            status
        });

        return res.status(201).json({
            message: "Subarea created successfully",
            success: true,
            data: rs
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};


/**
 * Get All Sub Areas
 */
exports.getAllSubAreas = async (req, res) => {
    try {
        const subareas = await subareaModel
            .find()
            .populate("area");

        return res.status(200).json({
            success: true,
            count: subareas.length,
            data: subareas
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};


/**
 * Get Single Sub Area
 */
exports.getSubAreaById = async (req, res) => {
    try {
        const subarea = await subareaModel
            .findById(req.params.id)
            .populate("area");

        if (!subarea) {
            return res.status(404).json({
                success: false,
                message: "Subarea not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: subarea
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};


/**
 * Update Sub Area
 */
exports.updateSubArea = async (req, res) => {
    try {
        const { name, area, postcode, status } = req.body;

        const subarea = await subareaModel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                area,
                postcode,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!subarea) {
            return res.status(404).json({
                success: false,
                message: "Subarea not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subarea updated successfully",
            data: subarea
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};


/**
 * Delete Sub Area
 */

exports.deleteSubArea = async (req, res) => {
    try {
        const subarea = await subareaModel.findByIdAndDelete(req.params.id);

        if (!subarea) {
            return res.status(404).json({
                success: false,
                message: "Subarea not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subarea deleted successfully"
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getsubareabyarea = async (req, res) => {
    try {
        const subareas = await subareaModel.find({
            area: req.params.id
        });

        if (subareas.length === 0) {
            return res.status(404).json({
                message: "Could not find any subareas for this area ID",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            subareas
        });

    } catch (error) {
        console.log("Error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
