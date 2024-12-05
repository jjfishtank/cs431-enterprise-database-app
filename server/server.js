const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 5000;

// CORS middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'flight_reservations'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.get('/flights', (req, res) => {
    let sql = 'SELECT * FROM flights WHERE DepartureTime > NOW()';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/seats', (req, res) => {
    const flightNumber = req.query.flightNumber;
    let sql = 'SELECT Class, isBooked, SeatNumber FROM seats WHERE FlightNumber = ?';
    db.query(sql, [flightNumber], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/customers/:id', (req, res) => {
    const id = req.params.id;
    let sql = 'SELECT * FROM customers WHERE CustomerID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/bank_accounts/:accountNumber', (req, res) => {
    const accountNumber = req.params.accountNumber;
    let sql = 'SELECT * FROM bank_accounts WHERE AccountNumber = ?';
    db.query(sql, [accountNumber], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.post('/reservations', (req, res) => {
    const data = req.body;
    
    const sql = 'INSERT INTO reservations SET ?';
    const reservationData = {
        Amount: parseFloat(data.Amount),
        BankAccountNumber: parseInt(data.BankAccountNumber),
        CardHolderName: data.CardHolderName,
        CardNumber: data.CardNumber,
        CustomerID: parseInt(data.CustomerID),
        CVV: data.CVV,
        ExpiryDate: data.ExpiryDate,
        FlightNumber: parseInt(data.FlightNumber),
        ReservationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        SeatNumber: parseInt(data.SeatNumber)
    };

    db.query(sql, reservationData, (err, result) => {
        if (err) {
            res.status(500).send(`SQL Error: ${err.message}`);
        } else {
            res.status(201).json(result);
        }
    });
});

app.get('/reservations', (req, res) => {
    const customerID = req.query.customerID;
    if (!customerID) {
        return res.status(400).send('CustomerID is required');
    }

    let sql = 'SELECT * FROM reservations WHERE CustomerID = ?';
    db.query(sql, [customerID], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
