const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username, password)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else {
      return res.status(404).json({message: "User already exists!!!"});
    }
  }

  return res.status(404).json({message: "Unable to register user."});

});


function getBook() {
  return new Promise((resolve, reject) => {
    resolve(books)
  })
}


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(200).send(JSON.stringify(books, null, 4));
  getBook().then((book) => res.status(200).json(JSON.stringify(book)));
});



function getISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    }
    else {
      reject({status: "404", message: `ISBN ${isbn} not found`})
    }
  })
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  // return res.status(200).send(JSON.stringify(books[id], null, 4));
  getISBN(isbn).then(
    result => res.send(result),
    error => res.status(error.status).json({message: error.message})
  )
 });
  

function getAuthor(author) {
  return new Promise((resolve, reject) => {
    for (const key in books) {
      if (books.hasOwnProperty(key) && books[key].author == author) {
        resolve(books[key]);
      }
      else {
        reject({status: "404", message: `Author ${author} not found`})
      }
    }
  })
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  getAuthor(author).then(
    result => res.send(result),
    error => res.status(error.status).json({message: error.message})
  )
});


function getTitle(title) {

  let titles = [];

  return new Promise((resolve, reject) => {
    for (const key in books) {
      if (books.hasOwnProperty(key) && books[key].title === title) {
        titles.push(books[key]);
      }
      // else {
      //   reject({status: "404", message: `Title ${title} not found`})
      // }
    }
    resolve(titles);
  })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // const title = [];
  // for (const key in books) {
  //   if (books.hasOwnProperty(key) && books[key].title === req.params.title) {
  //     title.push(books[key])
  //   }
  // }
  // return res.status(200).send(title);
  const title = req.params.title;
  getTitle(title).then(
    result => res.send(result),
    error => res.status(error.status).json({message: error.message})
  )
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn  = req.params.isbn;

  return res.status(200).send(books[isbn].reviews);

});

module.exports.general = public_users;
