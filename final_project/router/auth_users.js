const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return username && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find(user => user.username === username && user.password === password);
console.log("array of users ", users)
return !!user; // Returns true if the user exists, false otherwise
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Authentication failed." });
  }

  // Create a JWT token
  const token = jwt.sign({ username }, "token-key", { expiresIn: "1h" }); // Replace with your actual secret key

  return res.status(200).json({ message: "Login successful.", token });
});


//create users
regd_users.post('/update', function (req, res) {
  const { author, title } = req.body;

  if (!author || !title) {
    return res.status(400).json({ message: "Author and title are required fields." });
  }

  // Create a new book object
  const newBook = {
    author,
    title,
    reviews: {}
  };

  // Generate a new ISBN (you can replace this with your own logic)
  const newISBN = generateNewISBN();
  books[newISBN] = newBook;

  return res.status(201).json({ message: "Book created successfully.", book: newBook });
});

// Simulated function to generate a new ISBN
function generateNewISBN() {
  return Math.floor(Math.random() * 1000000); // Replace with your actual logic
}



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  console.log(req.headers.authorization)
  const book = books[isbn]; // Access the book directly using the ISBN as the key

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add the review to the book's reviews object or array
  if (!book.reviews) {
    book.reviews = []; // Initialize reviews if not present
  }
  book.reviews.push(review);

  return res.status(200).json({ message: "Review added successfully." });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;

