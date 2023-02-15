const jwt = require("jsonwebtoken");
// const User = require("../models/user");
const dbo = require("../db/conn.js");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await dbo.snapUsersMongo().findOne({
      email: decoded._id,
    });
    if (!user) {
      throw new Error("User Not Found");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ "Error!": "autorization required" });
  }
};

module.exports = auth;
