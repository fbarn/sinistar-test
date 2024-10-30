import React from 'react';
import './App.css';
import Header from './Components/Header/Header';
import APIMap from './Components/Map/APIMap';
import Box from '@mui/material/Box';

function App() {
  return (
    <div className="App">
      <Header height='64px' />
      <Box
        height='calc(100%-64px)'
      >
        <APIMap />
      </Box>
    </div>
  );
}

export default App;
