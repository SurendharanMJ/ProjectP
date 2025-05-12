const bcrypt = require("bcrypt");

async function encryptPassword(newpassword) {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(newpassword, salt);
  return encryptedPassword;
}

module.exports = encryptPassword;
