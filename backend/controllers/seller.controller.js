import User from "../models/User.js";

export const activateSeller = async (req, res) => {
  try {
    const {
      storeName,
      businessName,
      gstNumber,
      panNumber,
      aadhaarNumber,
      phone,
      address,
      bankName,
      accountNumber,
      ifscCode,
      documents,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.sellerProfile = {
      isSeller: true,
      verificationStatus: "pending",
      storeName,
      businessName,
      gstNumber,
      panNumber,
      aadhaarNumber,
      phone,
      address,
      bankName,
      accountNumber,
      ifscCode,
      documents,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Seller application submitted successfully.",
      sellerProfile: user.sellerProfile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getSellerProfile = async (req, res) => {

  try {

    const seller = await User.findById(req.user._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      seller,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const updateSellerProfile = async (req, res) => {

  try {

    const seller = await User.findById(req.user._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.sellerProfile = {
      ...seller.sellerProfile,
      ...req.body,
    };

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller profile updated.",
      seller,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const getSellerDashboard = async (req, res) => {

  try {

    const seller = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      sellerName: seller.name,
      verificationStatus:
        seller.sellerProfile.verificationStatus,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};