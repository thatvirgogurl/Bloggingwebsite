// ● Creating a new blog post
// ● Retrieving blog posts
// ● Retrieving a specific blog post by ID
// ● Updating a blog post by ID
// ● Deleting a blog post by ID
const { default: mongoose } = require("mongoose");
const authorModel = require("../Models/authorModel");
const blogModel = require("../Models/blogModel");

// ● Creating a new blog post
const createBlog = async function (req, res) {
  try {
    const { title, description, authorId } = req.body;
    if (!title || !description || !authorId)
      return res
        .status(400)
        .send({ status: false, msg: "all filds are required" });
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).send({ error: "Invalid Blog ID" });
    }
    let authorIdExits = await authorModel.findById({ _id: authorId });
    if (!authorIdExits)
      return res
        .status(401)
        .send({ status: false, msg: "author id is not valid" });
    const createBlogs = await blogModel.create(req.body);
    res.status(201).send({ status: true, data: createBlogs });
  } catch (error) {
    res.status(500).send(error);
  }
};
// ● Retrieving blog posts
const getAllBlogs = async function (req, res) {
  try {
    let obj = { isDeleted: false, isPublished: true };
    const allBlogs = await blogModel.find(obj);
    res.status(200).send({ msg: allBlogs });
  } catch (error) {
    res.status(500).send(error);
  }
};
// ● Retrieving a specific blog post by ID
const getBlogById = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send({ error: "Invalid Blog ID" });
    }
    const Blog = await blogModel.findById(blogId);

    if (!Blog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    if (Blog.isDeleted == false) {
      res.status(200).send({ msg: Blog });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
// ● Updating a blog post by ID
const updateBlogbyId = async function (req, res) {
  const { title, description } = req.body;
  let obj = {};
  if (title !== null) {
    obj.title = title;
  }
  if (description !== null) {
    obj.description = description;
  }

  let blogId = req.params.blogId;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).send({ error: "Invalid Blog ID" });
  }
  const Blog = await blogModel.findById(blogId);

  if (!Blog)
    return res.status(400).send({ status: false, msg: "Blog not found" });
  if (Blog.isDeleted == false) {
    const updateblog = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $set: obj },
      { upsert: true, new: true }
    );
    res.status(200).send({ status: true, data: updateblog });
  }
};
// ● Deleting a blog post by ID
const deleteBlogbyId = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send({ error: "Invalid Blog ID" });
    }
    const Blog = await blogModel.findById(blogId);

    if (!Blog)
      return res.status(400).send({ status: false, msg: "Blog not found" });

    if (Blog.isDeleted == false) {
      // Use findByIdAndUpdate to update the specific blog with the given ID
      const data = await blogModel.findByIdAndUpdate(blogId, {
        isDeleted: true,
      });
      if (data) {
        res.status(200).send({ status: true, msg: "Blog is deleted" });
      }
    } else {
      res.status(400).send({ status: false, msg: "Blog is already deleted" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlogbyId,
  deleteBlogbyId,
};
