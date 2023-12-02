const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const blogModel = require("../Models/authorModel");
const ObjectId = mongoose.Types.ObjectId;
const authentication = async function (req, res, next) {
  try {
    let token = req.headers["token-name"];
    if (!token) return res.status(400).send("token is missing");
    jwt.verify(token, "secreate-key", (error, decodedToken) => {
      if (error) {
        let msg =
          error.message == "jwt expired"
            ? "token is expired ,please login again"
            : "token is invalid,please recheck your token";
        res.status(401).send({ msg: msg });
      }
     // console.log(  decodedToken.authorId);
      req.decodedToken = decodedToken.authorId;
      next();
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
let authorization = async function (req, res, next) {
  try {
    if (req.query.authorId) {
      let authorId = req.query.authorId;
      if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).send({ error: "Invalid authorID" });
      }

      if (authorId !== req.decodedToken.toString()) {
        return res
          .status(403)
          .send({ status: false, message: "You are not an authorized user" });
      }

      return next();
    }

    if (req.params.blogId) {
      let blogId = req.params.blogId;
     // console.log(blogId);

      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).send({ error: "Invalid Blog ID" });
      }

      const Blog = await blogModel.findById({_id:blogId});
      
      if (!Blog) {
        return res.status(404).send({ error: "Blog not found" });
      }

      if (Blog.authorId.toString() !== req.decodedToken.toString()) {
        return res
          .status(403)
          .send({ status: false, message: "You are not an authorized user" });
      }

      return next();
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = { authentication, authorization };
