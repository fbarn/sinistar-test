import React from 'react';

import { APIProvider } from '@vis.gl/react-google-maps';

import Wrapper from './components/Wrapper'
import './App.css';

function App() {
  return (
    <div className="App">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}>
        <Wrapper />
      </APIProvider>
    </div >
  );
}

export default App;
