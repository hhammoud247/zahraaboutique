const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the current directory (includes mainpage.html, manage.html, etc.)
app.use(express.static(path.join(__dirname)));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // Replace with your MySQL user
    password: 'Kbbr247', // Replace with your MySQL password
    database: 'zahraaboutique'  // Replace with your MySQL database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Add a new product (from manage page)
app.post('/api/products', (req, res) => {
    const { title, price, size, image } = req.body;
    const query = 'INSERT INTO products (title, price, size, image) VALUES (?, ?, ?, ?)';
    db.query(query, [title, price, size, image], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'Product added successfully.' });
    });
});

// Get all products (to display on mainpage)
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(results);
    });
});

// Delete all products (optional for manage page, in case you want to reset everything)
app.delete('/api/products', (req, res) => {
    const query = 'DELETE FROM products';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: 'All products deleted successfully.' });
    });
});

// Serve the manage page (for adding products)
app.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'zahraabotiquemanagemain.html'));
});

// Serve the main page (to view products)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'zahraabotique.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
