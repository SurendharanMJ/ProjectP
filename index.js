const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const DB = require("./Connection/database");
const Cart = require("./models/Cart");
const Product = require("./models/Product");
const Router = require("./Routers/Routes");
const bodyParser = require("body-parser");
const Auth = require("./Models/Auth");
const { addListener } = require("process");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


require("./Controllers/WebsocketController")(io);


// DB.sync({alter: true})
// Auth.sync({alter: true})
// Cart.sync({alter:true})
// Product.sync({alter:true})

Cart.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Cart, { foreignKey: "product_id" });

app.use(express.json());
app.use("/api", Router);


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Product.html"));
});

const PORT = process.env.PORT || 1111;
server.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
