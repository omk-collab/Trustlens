const Evidence = require("../models/Evidence");
const cloudinary = require("../config/cloudinary");

const createEvidence = async (req, res) => {
  try {
    const {
      projectId,
      type,
      title,
      description,
      capturedDate,
      latitude,
      longitude,
    } = req.body;

    if (!projectId || !title || !capturedDate) {
      return res.status(400).json({
        success: false,
        message: "Project, title and captured date are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Evidence image is required",
      });
    }

    // Upload image to Cloudinary using unsigned upload preset
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.unsigned_upload_stream(
        "trustlens_upload",
        {
          folder: "trustlens/evidence",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("CLOUDINARY UPLOAD ERROR ❌");
            console.error(error);

            reject(error);
            return;
          }

          resolve(result);
        },
      );

      uploadStream.end(req.file.buffer);
    });

    const evidenceData = {
      projectId,
      type: type || "PHOTO",
      title: title.trim(),
      description: description || "",
      url: uploadResult.secure_url,
      capturedDate,
      verified: false,
    };

    // Add location only when coordinates are provided
    if (latitude && longitude) {
      evidenceData.location = {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
    }

    const evidence = await Evidence.create(evidenceData);

    res.status(201).json({
      success: true,
      message: "Evidence uploaded successfully",
      data: evidence,
    });
  } catch (error) {
    console.error("Evidence upload failed ❌");
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to upload evidence",
      error: error.message,
    });
  }
};

const getProjectEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find({
      projectId: req.params.projectId,
    }).sort({ capturedDate: -1 });

    res.status(200).json({
      success: true,
      count: evidence.length,
      data: evidence,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project evidence",
      error: error.message,
    });
  }
};

const verifyEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      {
        verified: true,
        verificationNote: req.body.verificationNote || "Evidence verified",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Evidence verified successfully",
      data: evidence,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to verify evidence",
      error: error.message,
    });
  }
};

const deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findByIdAndDelete(req.params.id);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: "Evidence not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Evidence deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete evidence",
      error: error.message,
    });
  }
};

module.exports = {
  createEvidence,
  getProjectEvidence,
  verifyEvidence,
  deleteEvidence,
};
