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
public_users.get('/', async (req, res) => { //async mehod to get all books
   console.log("geting all books!!!")
  try {
    return res.status(200).json({ books: await fetchAllBooks() });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching books." });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => { //converted to asynchronous function and using setTimeout to stimulate
  try {
    const { isbn } = req.params;
    const book = await fetchBookByISBN(isbn);

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    return res.status(200).json({ book });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching the book." });
  }
});





// Delete the book record based on ISBN
public_users.delete('/isbn/:isbn', async (req, res) => { // async method to delete books
  try {
    const { isbn } = req.params;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }

    delete books[isbn]; // Delete the book using the ISBN as the key

    console.log(books);

    return res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while deleting the book." });
  }
});



  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => { //async to get book by author
  try {
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
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching books by author." });
  }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => { //async search by title
  try {
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
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching books by title." });
  }
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






//simulated functions

async function fetchAllBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(booksArr);
    }, 1000); // Simulate a delay of 1 second
  });
}

// Simulated asynchronous function to fetch a book by ISBN
async function fetchBookByISBN(isbn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 1000); // Simulate a delay of 1 second
  });
}








module.exports.general = public_users;
