const { Op } = require("sequelize");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const GetToken = require("../Connection/functions");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected via WebSocket");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("userMessage", async (msg) => {
      const message = msg.trim().toLowerCase();
      console.log(`Received message: ${message}`);

      try {
        if (["hi", "hello", "hey"].includes(message)) {
          socket.emit("botMessage", "Hello! How can I help you today?");
          return;
        }

        if (message.includes("view cart")) {
          const cartItems = await Cart.findAll({
            include: [{ model: Product }],
            raw: true,
            nest: true,
          });

          if (cartItems.length === 0) {
            socket.emit("botMessage", "Your cart is empty.");
            return;
          }

          const grouped = {};
          cartItems.forEach(item => {
            const name = `${item.Product.Product_cat} (${item.type || "N/A"})`;
            grouped[name] = (grouped[name] || 0) + item.quantity;
          });

          let response = "Your cart:\n";
          let index = 1;
          for (const [name, qty] of Object.entries(grouped)) {
            response += `${index++}. ${name} - ${qty} pcs\n`;
          }

          socket.emit("botMessage", response.trim());
          return;
        }


        if (message.includes("price of")) {
          const words = message.split(" ");
          const keywordIndex = words.indexOf("of");
          const keyword = words[keywordIndex + 1];

          if (!keyword) {
            socket.emit("botMessage", "Please specify the product name after 'price of'.");
            return;
          }

          const product = await Product.findOne({
            where: {
              Product_cat: { [Op.like]: `%${keyword}%` }
            }
          });

          if (product) {
            socket.emit("botMessage", `The price of ${product.Product_cat} is ₹${product.price}`);
          } else {
            socket.emit("botMessage", `Sorry, I couldn't find the price for "${keyword}".`);
          }
          return;
        }

        if (message.startsWith("add ")) {
          const tokens = message.split(" ");
          if (tokens.length < 4) {
            socket.emit("botMessage", "Format should be: add <product> <type> <quantity>");
            return;
          }

          const [, productName, productType, qty] = tokens;
          const quantity = parseInt(qty, 10);

          if (!productName || !productType || isNaN(quantity)) {
            socket.emit("botMessage", "Format should be: add <product> <type> <quantity>");
            return;
          }

          const product = await Product.findOne({
            where: {
              Product_cat: { [Op.like]: `%${productName}%` }
            }
          });

          if (!product) {
            socket.emit("botMessage", `Product "${productName}" not found.`);
            return;
          }

    
          const existingCartItem = await Cart.findOne({
            where: {
              product_id: product.product_id,
              type: productType,
              quantity,
              product_category: product.Product_cat
            }
          });

          if (existingCartItem) {
            socket.emit("botMessage", `This item already exists in your cart.`);
            return;
          }

          await Cart.create({
            product_id: product.product_id,
            type: productType,
            quantity,
            product_category: product.Product_cat,
            auth_id: token.auth_id
          });

          socket.emit("botMessage", `Added ${quantity} ${productType} of ${product.Product_cat} to your cart.`);
          return;
        }

        
        socket.emit("botMessage", "I didn't understand that. Try: 'view cart', 'add <product> <type> <quantity>', or 'price of <product>'");
      } catch (err) {
        console.error("Error handling message:", err);
        socket.emit("botMessage", "Something went wrong. Please try again later.");
      }
    });
  });
};
