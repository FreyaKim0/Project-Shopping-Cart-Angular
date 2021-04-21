let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");

// create a reference to the model
let Book = require("../models/book");

// display book store
module.exports.displayBookList = (req, res, next) => {
  Book.find((err, bookList) => {
    if (err) {
      return console.error(err);
    } else {
      //console.log(BookList);

      /*
            res.render('book/list', 
            {title: 'Books', 
            BookList: bookList, 
            displayName: req.user ? req.user.displayName : ''});      
            */

      res.json(bookList);
    }
  });
};

// Add New books
module.exports.displayAddPage = (req, res, next) => {
  /*
    res.render('book/add', {title: 'Add Book', 
    displayName: req.user ? req.user.displayName : ''});
    */
  res.json({ success: true, msg: "Succesfully Displayed Add Page" });
};

module.exports.processAddPage = (req, res, next) => {
  const imagePath = "http://localhost:3500/images/" + req.file.filename;
  const price = Number(req.body.price);
  const originalPrice = Number(req.body.originalPrice);

  let newBook = Book({
    name: req.body.name,
    author: req.body.author,
    published: req.body.published,
    description: req.body.description,
    originalPrice: originalPrice,
    price: price,
    store: req.body.store,
    imagePath: imagePath,
    //image1: req.body.image1,
    //image2: req.body.image2,
    //image3: req.body.image3,
    //image4: req.body.image4,
    //image5: req.body.image5,
  });

  Book.create(newBook, (err) => {
    if (err) {
      res.json({
        success: false,
        msg: "Server: Failed at creating this new book.",
      });
    } else {
      res.json({ success: true, msg: y });
    }
  });
};

// Edit old books
module.exports.displayEditPage = (req, res, next) => {
  let id = req.params.id;

  Book.findById(id, (err, bookToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.json({
        success: true,
        msg: "Successfully Displayed Book to Edit",
        book: bookToEdit,
      });
    }
  });
};

module.exports.processEditPage = (req, res, next) => {
  let id = req.params._id;
  let imagePath = "http://localhost:3500/images/" + req.file.filename;
  let price = Number(req.body.price);
  let originalPrice = Number(req.body.originalPrice);

  let updatedBook = Book({
    _id: id,
    name: req.body.name,
    author: req.body.author,
    published: req.body.published,
    description: req.body.description,
    price: price,
    originalPrice: originalPrice,
    store: req.body.store,
    imagePath: imagePath,
  });

  Book.updateOne({ _id: id }, updatedBook, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.json({
        success: true,
        msg: "Successfully Edited Book",
        book: updatedBook,
      });
    }
  });
};

module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;

  Book.deleteOne({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the book list
      //res.redirect('/book-list');
      res.json({ success: true, msg: "Successfully Deleted Book" });
    }
  });
};
