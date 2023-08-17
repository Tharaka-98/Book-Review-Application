const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let user = [];

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists." });
    }

    users.push({ username, password });
    return res.status(300).json({ message: "User successfully registered." });
    //return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     //Write your code here
//     return res.status(300).send(JSON.stringify(books, null, 4));
// });


// Task 10: Get the list of books available in the shop using async-await and Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://your-api-endpoint/books'); // Replace with your API endpoint
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book list." });
    }
});

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     //Write your code here
//     const isbn = req.params.isbn;
//     return res.status(300).send(books[isbn]);
//     //return res.status(300).json({message: "Yet to be implemented"});
// });


// Task 11: Get book details based on ISBN using async-await and Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://your-api-endpoint/books/${isbn}`); // Replace with your API endpoint
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found." });
    }
});

// // Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     //Write your code here
//     const authorParam = req.params.author;
//     const matchingBooks = [];

//     for (const bookId in books) {
//         if (books.hasOwnProperty(bookId) && books[bookId].author === authorParam) {
//             matchingBooks.push(books[bookId]);
//         }
//     }

//     if (matchingBooks.length > 0) {
//         return res.status(300).json(matchingBooks);
//     } else {
//         return res.status(404).json({ message: "No books found for the provided author." });
//     }
//     //return res.status(300).json({message: "Yet to be implemented"});
// });


// Task 12: Get book details based on author using async-await and Axios
public_users.get('/author/:author', async function (req, res) {
    const authorParam = req.params.author;
    try {
        const response = await axios.get(`http://your-api-endpoint/books?author=${authorParam}`); // Replace with your API endpoint
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found for the provided author." });
    }
});

// // Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     //Write your code here
//     const titleParam = req.params.title;
//     const matchingBooks = [];

//     for (const bookId in books) {
//         if (books.hasOwnProperty(bookId) && books[bookId].title === titleParam) {
//             matchingBooks.push(books[bookId]);
//         }
//     }

//     if (matchingBooks.length > 0) {
//         return res.status(300).json(matchingBooks);
//     } else {
//         return res.status(404).json({ message: "No books found for the provided title." });
//     }
//     //return res.status(300).json({message: "Yet to be implemented"});
// });


// Task 13: Get book details based on title using async-await and Axios
public_users.get('/title/:title', async function (req, res) {
    const titleParam = req.params.title;
    try {
        const response = await axios.get(`http://your-api-endpoint/books?title=${titleParam}`); // Replace with your API endpoint
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found for the provided title." });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbnParam = req.params.isbn;
    const book = books[isbnParam];

    if (book) {
        const reviews = book.reviews;
        return res.status(300).json(reviews);
    } else {
        return res.status(404).json({ message: "Book not found for the provided ISBN." });
    }
    //return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
