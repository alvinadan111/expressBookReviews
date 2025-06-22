const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

function simulateAsync(delay = 3000, message = "Promise resolved") {
  return new Promise((resolve) => {
    setTimeout(() => resolve(message), delay);
  });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  simulateAsync()
    .then((successMessage) => {
      console.log("From Callback: " + successMessage);
      res.send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
      console.error("Promise error:", error);
      res.status(500).send("Something went wrong");
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  simulateAsync()
    .then((successMessage) => {
      console.log("From Callback: " + successMessage);
      if (book) res.send(book);
      else res.status(404).send("No such ISBN.");
    })
    .catch((error) => {
      console.error("Promise error:", error);
      res.status(500).send("Something went wrong");
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let book = Object.values(books).filter((book) => book.author === author);

  simulateAsync()
    .then((successMessage) => {
      console.log("From Callback: " + successMessage);
      if (book.length > 0) res.send(book);
      else res.status(404).send("No such author.");
    })
    .catch((error) => {
      console.error("Promise error:", error);
      res.status(500).send("Something went wrong");
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let book = Object.values(books).filter((book) => book.title === title);

  simulateAsync()
    .then((successMessage) => {
      console.log("From Callback: " + successMessage);
      if (book.length > 0) res.send(book);
      else res.status(404).send("No such title.");
    })
    .catch((error) => {
      console.error("Promise error:", error);
      res.status(500).send("Something went wrong");
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) res.send(book.reviews);
  else res.status(404).send("No such ISBN.");
});

module.exports.general = public_users;
