const express = require("express");
const { createProduct, getProduct, updateProduct, getProductByid, deleteProduct, SearchProductTable, getProductFilter } = require("../Controllers/ProductController");
const { findCart, addToCart, UpdateCart, findCartById, deleteCartById, SearchCartTable, SearchCartTableByLetter, getCartsFilter } = require("../Controllers/CartController");
const { createAuth, updateAuth, getAuth, getAuthById, deleteAuthById } = require("../Controllers/Authentication");
const { loginAuth } = require("../Controllers/LoginController");
const Router = express.Router();
const verify=require("../Connection/verify");
const verifyToken = require("../Connection/verify");


//SignUp
Router.post("/createUser",verify,createAuth);
Router.post("/updateUser/:id",verify,updateAuth);
Router.get("/getUser",verify,getAuth);
Router.get("/getUserbyId/:id",verify, getAuthById);
Router.delete("/deleteUser/:id",verify,deleteAuthById);

//Login
Router.get("/login",loginAuth)


//Product
Router.post("/createProducts",verify, createProduct)
Router.post("/updateProducts/:id",verify, updateProduct)
Router.get("/getProducts", verify,getProduct)
Router.get("/getProductById/:id",verify, getProductByid)
Router.delete("/deleteProduct/:id",verify, deleteProduct)
Router.get("/SearchProductTable",verify, SearchProductTable)
Router.get('/ProductFilter',verify, getProductFilter)


//Cart
Router.post("/AddToCart", verify,addToCart)
Router.post("/updateCart/:id",verify, UpdateCart)
Router.get('/findCart',verify,findCart)
Router.get("/getCartById/:id", verify,findCartById)
Router.delete("/deleteCart/:id",verify, deleteCartById)
Router.get("/getCartTableFilter",verify, SearchCartTableByLetter)
Router.get("/filterCartTable", verify,getCartsFilter)


module.exports = Router;  