// src/components/Flights.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../services/api';

function Flights() {
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        API.get('/flights')
            .then(response => {
                setFlights(response.data);
            })
            .catch(error => {
                console.error('Error fetching the flights!', error.message);
            });
    }, []);

    return (
        <div>
            <h1>Flights</h1>
            <table>
                <thead>
                    <tr>
                        <th>Flight Number</th>
                        <th>Company Name</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Departure Time</th>
                        <th>Arrival Time</th>
                        <th>Total Seats</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map(flight => (
                        <tr key={flight.FlightNumber}>
                            <td>{flight.FlightNumber}</td>
                            <td>{flight.CompanyName}</td>
                            <td>{flight.Origin}</td>
                            <td>{flight.Destination}</td>
                            <td>{new Date(flight.DepartureTime).toLocaleString()}</td>
                            <td>{new Date(flight.ArrivalTime).toLocaleString()}</td>
                            <td>{flight.TotalSeats}</td>
                            <td><Link to={`/reserve/${flight.FlightNumber}`}>Reserve Flight</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h1>Reservations</h1>
            <h1>BankAccounts</h1>
        </div>
    );
}

export default Flights;
