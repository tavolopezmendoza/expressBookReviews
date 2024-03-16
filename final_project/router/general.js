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


/*/ Get the book list available in the shop normal
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books));
});*/

// Get the book list available in the shop with promise
public_users.get('/', function (req, res) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(books), 500)
    });
    promise.then((result) => {
        //Asi se ve mejor
        return res.status(200).json({ books: result });
        //Asi se ve toda la informacion en una linea
        //return res.send(JSON.stringify(books));
    });
});

// Get book details based on ISBN normal way
/*public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});*/

// Get book details based on ISBN with promise
public_users.get("/isbn/:isbn", function (req, res) {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(books[req.params.isbn]), 1000);
    });
    const book = await promise;

    if (book) {
        return res.status(200).json({ book });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author normal
/*public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookAuthor = Object.values(books);
    const book = bookAuthor.filter((book) => book.author === author);
    res.status(200).json(book);
});*/
//Get book details based on author with promise
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookAuthor = Object.values(books);
    const bookPromise = new Promise((resolve, reject) => {
        const book = bookAuthor.filter((book) => book.author === author);
        if (bookAuthor) {
            resolve(res.status(200).json(book));
        } else {
            reject(res.status(404).json(`No book found for the author ${author}`));
        }
    });
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