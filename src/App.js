import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlShortenerWithAuth from './components/UrlShortenerWithAuth';


// Import other components as needed

const App = () => {
    return (
        <Router>
            <div>
                <h1>My URL Shortener App</h1>
                <Routes>
                 
                    <Route path="/" element={<UrlShortenerWithAuth />} />
                  

                </Routes>
            </div>
        </Router>
    );
};

export default App;

