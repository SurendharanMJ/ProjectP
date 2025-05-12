const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  
  const token =
    req.headers.authorization

  if (!token) {
    return res.status(403).send({ message: "Token is Required" });
  }
  jwt.verify(token, "Sure", (err) => {
    if (err) return res.status(401).send({ message: "Invalid Token" });
    return next();
  });
};

module.exports = verifyToken;
