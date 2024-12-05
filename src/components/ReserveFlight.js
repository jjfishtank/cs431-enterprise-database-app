/* src/components/ReserveFlight.js */
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom';
import styles from './ReserveFlight.module.css';

function ReserveFlight() {
    const { flightNumber } = useParams();
    const [seats, setSeats] = useState([]);
    const [formData, setFormData] = useState({
        Amount: '',
        BankAccountNumber: '',
        CardHolderName: '',
        CardNumber: '',
        CustomerID: '',
        CVV: '',
        ExpiryDate: '',
        SeatNumber: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        API.get(`/seats?flightNumber=${flightNumber}`)
            .then(response => {
                setSeats(response.data);
            })
            .catch(error => {
                console.error('Error fetching seats', error.message);
            });
    }, [flightNumber]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!/^\d{4}$/.test(formData.CVV)) {
            setError('CVV must be 4 digits');
            return;
        }

        if (!formData.Amount || !formData.BankAccountNumber || !formData.CardHolderName || !formData.CardNumber || !formData.CustomerID || !formData.CVV || !formData.ExpiryDate || !formData.SeatNumber) {
            setError('All fields are required');
            return;
        }
        
        // Check customer and bank account validity
        Promise.all([
            API.get(`/customers/${formData.CustomerID}`),
            API.get(`/bank_accounts/${formData.BankAccountNumber}`)
        ]).then(([customerResponse, bankAccountResponse]) => {
            if (customerResponse.data.length === 0 || bankAccountResponse.data.length === 0) {
                setError('Invalid Customer ID or Bank Account Number');
                return;
            }

            // Submit reservation
            const reservationData = {
                Amount: parseFloat(formData.Amount),
                BankAccountNumber: parseInt(formData.BankAccountNumber),
                CardHolderName: formData.CardHolderName,
                CardNumber: formData.CardNumber,
                CustomerID: parseInt(formData.CustomerID),
                CVV: formData.CVV,
                ExpiryDate: formData.ExpiryDate,
                FlightNumber: parseInt(flightNumber),
                ReservationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                SeatNumber: parseInt(formData.SeatNumber)
            };

            API.post('/reservations', JSON.stringify(reservationData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                alert('Reservation successfully created');
                setError('');
            })
            .catch(err => {
                // Reservation INSERT Constraint Failure. Render error message.
                setError(`${err.response.data.error}`);
            });
        }).catch(err => {
            setError(`Error: ${JSON.stringify(err.response)}`);
        });
    };

    return (
        <div>
            <h2 style={{textAlign:'center'}}>Reserve Flight {flightNumber}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={styles.seatContainer}>
                <div className={styles.seatGrid}>
                    {seats.map(seat => (
                        <div 
                            key={seat.SeatNumber} 
                            className={`${styles.seat} ${seat.isBooked ? styles.booked : styles.available}`}
                        >
                            <p>Seat Number: {seat.SeatNumber}</p>
                            <p>Class: {seat.Class}</p>
                            <p>Is Booked: {seat.isBooked ? 'Yes' : 'No'}</p>
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit} class={styles.reservationForm}>
                <div class={styles.formGroup}>
                    <label>Amount</label>
                    <input type="number" min="0.00" step="0.01" name="Amount" value={formData.Amount} onChange={handleChange} required />
                </div>
                <div class={styles.formGroup}>
                    <label>Bank Account Number</label>
                    <input type="text" name="BankAccountNumber" value={formData.BankAccountNumber} onChange={handleChange} required />
                </div>
                <div class={styles.formGroup}>
                    <label>Card Holder Name</label>
                    <input type="text" name="CardHolderName" value={formData.CardHolderName} onChange={handleChange} required />
                </div>
                <div class={styles.formGroup}>
                    <label>Card Number</label>
                    <input type="text" name="CardNumber" value={formData.CardNumber} onChange={handleChange} required />
                </div>
                <div class={styles.formGroup}>
                    <label>Customer ID</label>
                    <input type="text" name="CustomerID" value={formData.CustomerID} onChange={handleChange} required />
                </div>
                <div class={styles.formGroup}>
                    <label>CVV</label>
                    <input type="text" name="CVV" value={formData.CVV} onChange={handleChange} required />
                </div>
                <div class={styles.formGroup}>
                    <label>Expiry Date</label>
                    <input type="date" name="ExpiryDate" value={formData.ExpiryDate} onChange={handleChange} required />
                </div>
                <div class={styles.formGroup}>
                    <label>Seat Number</label>
                    <input type="number" min="1" max={seats.length} step="1" name="SeatNumber" value={formData.SeatNumber} onChange={handleChange} required />
                </div>
                <button type="submit" class={styles.formButton}>Reserve</button>
            </form>
        </div>
    );
}

export default ReserveFlight;
