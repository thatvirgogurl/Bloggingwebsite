const mongoose=require('mongoose');
const authorModel = require('./authorModel');
const ObjectId=mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    authorId: {
      type: ObjectId,
      ref: "NewAuthor",
      require:true
    },
    isDeleted: {type:Boolean,default:false},
    isPublished:{ type:Boolean,default:true}
  },
  { timestamps: true }
);
module.exports=mongoose.model("NewBlog",blogSchema);