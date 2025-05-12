const jwt = require("jsonwebtoken");
require("dotenv").config();

const GetToken = (req) => {
  let token =
   
    req.headers.authorization

  if (!token) return null;

  if (typeof token === "string" && token.startsWith("Bearer")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_NAME);
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
};

module.exports = GetToken;
