const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    // Add more users if needed
];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username." });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
        req.session.authorization = {
            accessToken,
            username
        };
        return res.status(200).json({ message: "User successfully logged in.", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review; // Get the review from the query parameter
    const username = req.session.authorization.username;

    if (!reviewText) {
        return res.status(400).json({ message: "Review text is required." });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found for the provided ISBN." });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Check if the user has already posted a review for the same ISBN
    if (books[isbn].reviews[username]) {
        // If yes, modify the existing review
        books[isbn].reviews[username] = reviewText;
        return res.status(200).json({ message: "Review updated successfully." });
    } else {
        // If no, add a new review
        books[isbn].reviews[username] = reviewText;
        return res.status(200).json({ message: "Review added successfully." });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found for the provided ISBN." });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for the provided ISBN and username." });
    }

    // Delete the review for the specific username
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully." });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
