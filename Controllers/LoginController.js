const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Auth = require("../Models/Auth");
require("dotenv").config();

exports.loginAuth = async (req, res) => {
  const body = req.body;
  const data = {
    username: body.username,
    password: body.password
  }

  const username = data.username;
  const password = data.password;
  console.log(password, "ss");


  try {
    const user = await Auth.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log(user.dataValues.password, "s");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { auth_id: user.auth_id, username: user.username },
      process.env.JWT_TOKEN_NAME,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      message: "Login successful",
      token,
      user: {
        auth_id: user.auth_id,
        username: user.username,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};
