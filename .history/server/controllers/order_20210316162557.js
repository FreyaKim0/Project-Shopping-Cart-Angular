let express = require("express");
let router = express.Router();
let Order = require("../models/order");
let Store = require("../models/store");
let Cart = Store.Cart;
let Book = Store.Book;

module.exports.displayOrderList = (req, res, next) => {
  Order.find((err, orderList) => {
    if (err) {
      return console.error(err);
    } else {
      res.json(orderList);
    }
  });
};

module.exports.processAddPage = (req, res, next) => {
  // Serialize the Cart Data
  let cart = new Cart();

  // Serialize the Line Data (each purchase item)
  // 檢查前端的line有順利存到嗎? 有
  // 但是後端的array=[] 長度是0

  let book_data = JSON.parse(req.body.cart.lines.book);
  let _id = book_data[0];
  let name = book_data[1];
  let author = book_data[2];
  let published = book_data[3];
  let description = book_data[4];
  let price = book_data[5];
  let store = book_data[6];
  let originalPrice = book_data[7];
  let __v = book_data[8];

  let book = new Book(
    _id,
    name,
    author,
    published,
    description,
    price,
    store,
    originalPrice,
    __v
  );

  let quantity = req.body.cart.lines.quantity;
  cart.lines.push({ book: book, quantity: quantity });

  cart.itemCount = req.body.cart.itemCount;
  cart.cartPrice = req.body.cart.cartPrice;

  // Create a new Order Object
  let newOrder = Order({
    buyer: req.body.buyer,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    province: req.body.province,
    postalCode: req.body.postalCode,
    country: req.body.country,
    shipped: req.body.shipped,
    cart: cart,
  });

  // Add New Order Object to the Database
  Order.create(newOrder, (err, Order) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.json({ success: true, msg: "Successfully Added New Order" });
    }
  });
};

module.exports.processEditPage = (req, res, next) => {
  let id = req.params.id;

  // SERIALIZE CART DATA

  let cart = new Cart();

  // serialize the line data
  for (let line of req.body.cart.lines) {
    let book = new Book(
      //line.book.originalPrice,
      //line.book.store,
      line.book._id,
      line.book.name,
      line.book.author,
      line.book.description,
      line.book.price
    );
    let quantity = line.quantity;
    cart.lines.push({ book, quantity });
  }
  cart.itemCount = req.body.cart.itemCount;
  cart.cartPrice = req.body.cart.cartPrice;

  // Update the Order Object
  let updatedOrder = Order({
    _id: id,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    province: req.body.province,
    postalCode: req.body.postalCode,
    country: req.body.country,
    shipped: req.body.shipped,
    cart: cart,
  });

  Order.updateOne({ _id: id }, updatedOrder, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.json({
        success: true,
        msg: "Successfully Edited Order",
        order: updatedOrder,
      });
    }
  });
};

module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;

  Order.deleteOne({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.json({ success: true, msg: "Successfully Deleted Order" });
    }
  });
};
