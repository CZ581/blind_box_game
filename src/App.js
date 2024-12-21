import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page0 from './pages/entry';
import Page1 from './pages/gyRoll1'; 
import Page2 from './pages/gyRoll3';
import Page3 from './pages/skRoll1';
import Page4 from './pages/skRoll3';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page0 />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
      </Routes>
    </Router>
  );
};

export default App;