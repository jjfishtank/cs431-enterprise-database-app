// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Flights from './components/Flights';
import ReserveFlight from './components/ReserveFlight.js';
import SearchReservations from './components/SearchReservations';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/reserve/:flightNumber" element={<ReserveFlight />} />
                <Route path="/" element={
                    <div>
                        <Flights />
                        <SearchReservations />
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
