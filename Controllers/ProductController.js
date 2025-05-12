const { Op } = require("sequelize");
const Product = require("../models/Product");
const GetToken = require("../Connection/functions");

exports.createProduct = async (req, res) => {
  const token = GetToken(req);
  const body = req.body;

  const data = {
    Product_cat: body.Product_cat,
    type: body.type,
    price: body.price,
    auth_id: token.auth_id,
    createdAt: +new Date()
  };

  try {
    await Product.create(data);
    res.status(200).send({ message: "Product Created" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  const token = GetToken(req);
  const body = req.body;
  const product_id = req.params.id;

  const data = {
    Product_cat: body.Product_cat,
    type: body.type,
    price: body.price,
    updated_at: +new Date()
  };

  try {
    const updated = await Product.update(data, {
      where: {
        product_id: product_id,
        auth_id: token.auth_id
      }
    });

    if (updated[0] === 0) {
      return res.status(404).send({ message: "Product not found or not authorized" });
    }

    res.status(200).send({ message: "Product updated" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Failed to update product" });
  }
};

exports.getProduct = async (req, res) => {
  const token = GetToken(req);

  try {
    const getProd = await Product.findAll({
      where: { auth_id: token.auth_id }
    });
    res.status(200).send({ data: getProd });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Failed to fetch products" });
  }
};

exports.getProductByid = async (req, res) => {
  const token = GetToken(req);
  const product_id = req.params.id;

  try {
    const getProd = await Product.findOne({
      where: {
        product_id: product_id,
        auth_id: token.auth_id
      }
    });

    if (!getProd) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({ data: getProd });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Failed to fetch product" });
  }
};

exports.deleteProduct = async (req, res) => {
  const token = GetToken(req);
  const id = req.params.id;

  try {
    const deleted = await Product.destroy({
      where: {
        product_id: id,
        auth_id: token.auth_id
      }
    });

    if (deleted === 0) {
      return res.status(404).send({ message: "Product not found or not authorized" });
    }

    res.status(200).send({ message: "Product deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Invalid Action" });
  }
};

exports.SearchProductTable = async (req, res) => {
  const token = GetToken(req);
  const { letter } = req.query;

  if (!letter) {
    return res.status(400).send({ message: "Letter is required" });
  }

  try {
    const filteredProduct = await Product.findAll({
      where: {
        product_cat: { [Op.like]: `${letter}%` },
        auth_id: token.auth_id
      }
    });

    if (filteredProduct.length === 0) {
      res.status(200).send({ message: "No product found for this letter" });
    } else {
      res.status(200).send(filteredProduct);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "Can't fetch products" });
  }
};

exports.getProductFilter = async (req, res) => {
  const token = GetToken(req);
  const { product_category, type, price } = req.query;

  try {
    const filters = { auth_id: token.auth_id };

    if (product_category) filters.product_cat = product_category;
    if (type) filters.type = type;
    if (price) filters.price = price;

    const findProduct = await Product.findAll({ where: filters });

    if (findProduct.length > 0) {
      res.status(200).send({ data: findProduct });
    } else {
      res.status(200).send({ message: "No products found" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Invalid action" });
  }
};
