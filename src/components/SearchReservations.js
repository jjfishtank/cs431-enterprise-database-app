/* src/components/SearchReservations.js */
import React, { useState } from 'react';
import API from '../services/api';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
 
DataTable.use(DT);

function SearchReservations() {
    const [customerID, setCustomerID] = useState('');
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCustomerID(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!customerID) {
            setError('Please enter a Customer ID.');
            return;
        }

        API.get(`/reservations?customerID=${customerID}`)
            .then(response => {
                if (response.data.length === 0) {
                    setError('No reservations found for this Customer ID.');
                    setReservations([]);
                } else {
                    setReservations(response.data);
                    setError('');
                }
            })
            .catch(error => {
                console.error('Error fetching reservations', error.message);
                setError('Error fetching reservations');
            });
    };

    const columns = [
        { title: 'Reservation ID', data: 'ReservationID' },
        { title: 'Flight Number', data: 'FlightNumber' },
        { title: 'Seat Number', data: 'SeatNumber' },
        { title: 'Amount', data: 'Amount' },
        { title: 'Reservation Date', data: 'ReservationDate', render: (data) => new Date(data).toLocaleString() }
    ];

    return (
        <div>
            <h2>Find Reservations</h2>
            <form onSubmit={handleSubmit}>
                <label>Enter Customer ID:</label>
                <input style={{marginLeft:'10px', marginRight:'5px'}} type="text" value={customerID} onChange={handleChange} required />
                <button type="submit">Search</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {reservations.length > 0 && (
                <DataTable
                    columns={columns}
                    data={reservations}
                    options={{
                        responsive: true,
                        pagelength: 5,
                        lengthChange: false,
                        searching: false,
                        ordering: true,
                        layout: {
                            topStart: function () {
                                let title = document.createElement('h4');
                                title.innerHTML = `Reservations for Customer ${customerID}`;
                                return title;
                            }
                        }
                    }}
                />
            )}
        </div>
    );
}

export default SearchReservations;
