let mongoose = require("mongoose");

// create a model class
let bookModel = mongoose.Schema(
  {
    name: String,
    author: String,
    published: String,
    description: String,
    originalPrice: Number,
    price: Number,
    store: String,
    imagePath: String,
  },
  {
    collection: "books",
  }
);

module.exports = mongoose.model("Book", bookModel);
