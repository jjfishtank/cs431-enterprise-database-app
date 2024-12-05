/* src/components/Flights.js */
import React from 'react';
import { useEffect, useState } from 'react';
import API from '../services/api';
import styles from "./Flights.module.css";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-responsive-dt';
 
DataTable.use(DT);

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

    const columns = [
        { title: 'Flight Number', data: 'FlightNumber' },
        { title: 'Company Name', data: 'CompanyName' },
        { title: 'Origin', data: 'Origin' },
        { title: 'Destination', data: 'Destination' },
        { title: 'Departure Time', data: 'DepartureTime', render: (data) => new Date(data).toLocaleString() },
        { title: 'Arrival Time', data: 'ArrivalTime', render: (data) => new Date(data).toLocaleString() },
        { title: 'Total Seats', data: 'TotalSeats' },
        { title: 'Action', data: 'FlightNumber', render: (data) => `<a href="/reserve/${data}">Reserve Flight</a>` },
    ];

    return (
        <div>
            <div class={styles.tableContainer}>
                <DataTable class="display" columns={columns} data={flights} options={{
                    responsive: true,
                    lengthChange: false,
                    layout: {
                        topStart: function () {
                            let title = document.createElement('h2');
                            title.style.margin = "auto";
                            title.innerHTML = 'Flights';
                            return title;
                        }
                    }
                }}>
                </DataTable>
            </div>
        </div>
    );
}

export default Flights;
