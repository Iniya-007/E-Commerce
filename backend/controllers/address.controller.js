import Address from "../models/Address.js";

export const addAddress = async (
  req,
  res
) => {
  try {
    const address =
      await Address.create({
        ...req.body,
        user: req.user._id,
      });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAddresses = async (
  req,
  res
) => {
  try {
    const addresses =
      await Address.find({
        user: req.user._id,
      });

    res.status(200).json(
      addresses
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateAddress =
  async (req, res) => {
    try {
      const address =
        await Address.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.user._id,
          },
          req.body,
          {
            new: true,
          }
        );

      if (!address) {
        return res.status(404).json({
          message:
            "Address not found",
        });
      }

      res.status(200).json(
        address
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteAddress =
  async (req, res) => {
    try {
      const address =
        await Address.findOneAndDelete(
          {
            _id: req.params.id,
            user: req.user._id,
          }
        );

      if (!address) {
        return res.status(404).json({
          message:
            "Address not found",
        });
      }

      res.status(200).json({
        message:
          "Address deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };