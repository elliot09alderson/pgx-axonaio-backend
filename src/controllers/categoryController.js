const CategoryDetails = require("../models/CategorySchema");

const categoryCreate = async (req, res) => {
  try {
    const { name } = req.body;
    const data = new CategoryDetails({
      name,
      status: req.body.status ?? false,
    });
    const categoryData = await data.save();
    res.status(201).json(categoryData);
  } catch (error) {
    console.log(error);
    res.status(500).json("server is pr!");
  }
};

module.exports = {
  categoryCreate,
};
