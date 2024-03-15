const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  if (!user.isAdmin) {
    user.isAdmin = false;
  }

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
