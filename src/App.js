// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Flights from './components/Flights';
import ReserveFlight from './components/ReserveFlight.js';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Flights/>} />
                <Route path="/reserve/:flightNumber" element={<ReserveFlight/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
