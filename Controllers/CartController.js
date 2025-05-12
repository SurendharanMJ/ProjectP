const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { Op } = require("sequelize");
const GetToken = require("../Connection/functions");

exports.addToCart = async (req, res) => {
  const token = GetToken(req);
  const { quantity, type, product_category, price } = req.body;

  try {
    let product = await Product.findOne({
      where: {
        product_cat: product_category,
        type,
        auth_id: token.auth_id
      }
    });

    if (!product) {
      product = await Product.create({
        product_cat: product_category,
        type,
        price,
        auth_id: token.auth_id,
        createdAt: new Date()
      });
    }

    const existingCartItem = await Cart.findOne({
      where: {
        auth_id: token.auth_id,
        product_category: product_category,
        type: type,
        quantity: quantity
      }
    });

    if (existingCartItem) {
      return res.status(200).send({ message: "Product already exists in the cart" });
    }

    const cart = await Cart.create({
      quantity,
      type,
      product_category,
      product_id: product.product_id,
      auth_id: token.auth_id
    });
    console.log(cart,"sss");
    

    res.status(200).send({ message: "Cart created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Something went wrong!" });
  }
};




exports.UpdateCart = async (req, res) => {
  const token = GetToken(req);
  const carts_id = req.params.id;
  log
  const { quantity, product_cat } = req.body;

  try {
    const product = await Product.findOne({
      where: {
        product_cat: product_cat,
        auth_id: token.auth_id
      }
    });

    if (!product) {
      return res.status(404).send({ message: "Product not found for given category" });
    }

    const existingCart = await Cart.findOne({
      where: {
        carts_id: carts_id,
        auth_id: token.auth_id
      }
    });

    if (!existingCart) {
      return res.status(404).send({ message: "Cart item not found" });
    }

    await Cart.update(
      {
        quantity,
        type: product.type,
        product_category: product.product_cat
      },
      {
        where: {
          carts_id: carts_id,
          auth_id: token.auth_id
        }
      }
    );

    res.status(200).send({ message: "Cart updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating cart" });
  }
};

exports.findCart = async (req, res) => {
  const token = GetToken(req);

  try {
    const cartWithProducts = await Cart.findAll({
      where: { auth_id: token.auth_id }
    });

    res.status(200).send({ data: cartWithProducts });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Invalid Action" });
  }
};

exports.findCartById = async (req, res) => {
  const token = GetToken(req);
  const id = req.params.id;

  try {
    const findcart = await Cart.findOne({
      where: {
        carts_id: id,
        auth_id: token.auth_id
      }
    });

    res.status(200).send({ message: findcart });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Invalid Action" });
  }
};

exports.deleteCartById = async (req, res) => {
  const token = GetToken(req);
  const id = req.params.id;

  try {
    await Cart.destroy({
      where: {
        carts_id: id,
        auth_id: token.auth_id
      }
    });

    res.status(200).send({ message: "Cart Item Deleted Successfully !!" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Invalid Action" });
  }
};

exports.SearchCartTableByLetter = async (req, res) => {
  const token = GetToken(req);
  const { letter } = req.query;

  if (!letter) {
    return res.status(400).send({ message: "Letter query parameter is required" });
  }

  try {
    const filteredCart = await Cart.findAll({
      where: {
        product_category: { [Op.like]: `${letter}%` },
        auth_id: token.auth_id
      }
    });

    if (filteredCart.length === 0) {
      res.status(200).send({ message: "No cart items for this letter" });
    } else {
      res.status(200).send(filteredCart);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "Can't fetch cart items" });
  }
};

exports.getCartsFilter = async (req, res) => {
  const token = GetToken(req);
  const { product_category, type, quantity } = req.query;

  try {
    const filters = { auth_id: token.auth_id };

    if (product_category) filters.product_category = product_category;
    if (type) filters.type = type;
    if (quantity) filters.quantity = quantity;

    const products = await Cart.findAll({ where: filters });

    if (products.length > 0) {
      return res.status(200).json({ data: products });
    } else {
      return res.status(200).json({ message: "No products in cart" });
    }
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
