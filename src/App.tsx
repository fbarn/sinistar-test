import React from 'react';
import './App.css';
import Header from './Components/Header/Header';
import APIMap from './Components/Map/APIMap';
import Box from '@mui/material/Box';
import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  return (
    <div className="App">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}>
        <Header height='64px' />
        <Box
          height='calc(100%-64px)'
        >
          <APIMap />
        </Box>
      </APIProvider>
    </div >
  );
}

export default App;
