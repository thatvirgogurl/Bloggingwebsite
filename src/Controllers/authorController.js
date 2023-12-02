const bcrypt = require("bcrypt");
const authormodel = require("../Models/authorModel.js");
const { isValid, isEmail } = require("../validator/validation.js"); 
const jwt=require("jsonwebtoken")

const createAuthor = async function (req, res) {
  try {
    const body = req.body;
    const { authorName, email, password } = { ...body }; //destructer req.body part
    if(!authorName) return res.status(400).send('authorNAme required');
    if (!email) return res.status(400).send("authorNAme required");
    if (!password) return res.status(400).send("authorNAme required");
    if (!isValid(authorName)) {
      return res
        .status(400)
        .send({ error: "Please provide a valid authorName" });
    }
    if (!isValid(password)) {
      return res
        .status(400)
        .send({ error: "Please provide a valid authorName" });
    }
    // Validate email format
    if (!isEmail(email)) {
      return res
        .status(400)
        .send({ error: "Please provide a valid email address" });
    }
    const authorExits = await authormodel.findOne({ email: email });
    if(authorExits) return res.status(400).send('this email is alraedy Register')
    // Generate a salt and hash the author's name and password
    const salt = await bcrypt.genSalt(10);
    const hashName = await bcrypt.hash(authorName, salt);
    const hashPassword = await bcrypt.hash(password, salt);

    // Now, you can save 'hashName' in your database
    const createAuth = await authormodel.create(
      {
        authorName: hashName,
        email: email,
        password: hashPassword,
        // date: new Date(),
      }
    );

    // Send the response with hashed author's name
    res.status(201).send({ createAuth });
  } catch (error) {
    res.status(500).send(error);
  }
};
const loginAuthor=async function(req,res){
    try {
        const {authorName,email,password}=req.body;
        let verifyAuthor=await authormodel.findOne({email:email})
        if (verifyAuthor) {
          const verifyAuth = await bcrypt.compare(
            authorName,
            verifyAuthor.authorName
          );
          if (!verifyAuth)
            return res.status(400).send("check your author name");
          const verifypass = await bcrypt.compare(
            password,
            verifyAuthor.password
          );
          if (!verifypass) return res.status(400).send("check your password");
        } else {
            return res.status(400).send("Author is not registered")
        }
        let token=jwt.sign(
            {
            authorId:verifyAuthor._id.toString(),
            organisation:'stackLab'
            },"secreate-key"
        )
        res.status(200).send({ token: token, authorId: verifyAuthor._id});
    } catch (error) {
        res.status(500).send(error)  
    }

}
module.exports = { createAuthor, loginAuthor };
