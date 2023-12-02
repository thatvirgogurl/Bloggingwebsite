const express= require('express')
const router =express.Router();
const Author = require("../Controllers/authorController.js");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlogbyId,
  deleteBlogbyId
} = require("../Controllers/blogController.js");
const { authentication, authorization } = require("../middleware/auth.js");



//1.Create Author
router.post("/createauthor", Author.createAuthor);
//2.loginAUthor
router.post("/login", Author.loginAuthor);
//3.createBlogs
router.post("/createBlog", authentication, authorization, createBlog);
// GET BLOGS 
router.get("/blogs", authentication, getAllBlogs);
///get specific blog post by ID
router.get("/blog/:blogId", authentication, authorization, getBlogById);
///delete a specific blog post by ID
router.patch(
  "/updateblog/:blogId",
  authentication,
  authorization,
  updateBlogbyId
);

///delete a specific blog post by ID
router.delete(
  "/deleteBlog/:blogId",
  authentication,
  authorization,
  deleteBlogbyId
);


module.exports=router;