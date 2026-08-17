import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const uploadProfileImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.profileImage = req.file.path;
    user.profileImagePublicId = req.file.filename;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      profileImage: user.profileImage,
      user
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

//Delete profile img

export const deleteProfileImage = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    // Delete from Cloudinary

    if (user.profileImagePublicId) {

      await cloudinary.uploader.destroy(
        user.profileImagePublicId
      );

    }

    user.profileImage = "";

    user.profileImagePublicId = "";

    await user.save();

    res.status(200).json({

      success: true,

      message: "Profile photo removed"

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

//Get Peofile

export const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// Become Seller
export const becomeSeller = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isSeller = true;
    user.activeMode = "seller";

    await user.save();

    res.status(200).json({
      message: "Seller account activated successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// Update Store Details
export const updateStore = async (req, res) => {

  try {

    const {
      storeName,
      storeDescription,
      storeLogo,
      storePhone,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.storeName = storeName;
    user.storeDescription = storeDescription;
    user.storeLogo = storeLogo;
    user.storePhone = storePhone;

    await user.save();

    res.status(200).json({
      message: "Store updated successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

//Upload profile


export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is already used by another account
   if (email && email !== user.email) {
  const existingUser = await User.findOne({
    email,
    _id: { $ne: user._id }, // ignore the current user
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }
}

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
