const mongoose=require('mongoose')

const AuthorShema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      require: true,
    },
    // ,
    // date: Date,
  },
  { timestamps: true }
);
module.exports=mongoose.model('NewAuthor',AuthorShema)