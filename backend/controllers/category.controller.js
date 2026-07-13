import Category from "../models/Category.js";

export const createCategory =
  async (req, res) => {
    try {
      const category =
        await Category.create({
          name: req.body.name,
        });

      res.status(201).json(
        category
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getCategories =
  async (req, res) => {
    try {
      const categories =
        await Category.find();

      res.status(200).json(
        categories
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const updateCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      if (!category) {
        return res.status(404).json({
          message:
            "Category not found",
        });
      }

      res.status(200).json(
        category
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteCategory =
  async (req, res) => {
    try {
      const category =
        await Category.findByIdAndDelete(
          req.params.id
        );

      if (!category) {
        return res.status(404).json({
          message:
            "Category not found",
        });
      }

      res.status(200).json({
        message:
          "Category deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };