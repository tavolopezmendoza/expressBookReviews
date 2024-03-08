const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ mesage: "User successfully registered." });
        } else {
            return res.status(404).json({message: "User already exists."})
        }
    }
    return res.status(404).json({message: "Unable to register user."})
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookAuthor = Object.values(books);
    const book = bookAuthor.filter((book) => book.author === author);
    res.status(200).json(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.titler;
    const bookTitle = Object.values(books);
    const book = bookTitle.filter((book) => book.title === title);
    res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].review)
});

module.exports.general = public_users;
