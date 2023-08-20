const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const booksArr = []
booksArr.push(books)


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  // Check if the username is already registered
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already registered." });
  }

  // Create a new user object and add it to the users array
  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: "Registration successful." });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ books });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn]; // Access the book directly using the ISBN as the key

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json({ book });
});

// Delete the book record based on ISBN
public_users.delete('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  delete books[isbn]; // Delete the book using the ISBN as the key

  console.log(books)

  return res.status(200).json({ message: "Book deleted successfully." });
});


  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const booksByAuthor = [];

  // Iterate through the books object to find books by the specified author
  for (const isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found for this author." });
  }

  return res.status(200).json({ books: booksByAuthor });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const booksWithTitle = [];

  // Iterate through the books object to find books with matching titles
  for (const isbn in books) {
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      booksWithTitle.push(books[isbn]);
    }
  }

  if (booksWithTitle.length === 0) {
    return res.status(404).json({ message: "No books found with this title." });
  }

  return res.status(200).json({ books: booksWithTitle });
});



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn]; // Access the book directly using the ISBN as the key

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json({ reviews: book.reviews });
});



module.exports.general = public_users;
