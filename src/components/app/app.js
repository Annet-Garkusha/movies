import React from "react";

import './app.css'

import FilmItem from "../films/films";
import Connect from "../connect/connect";


function App( { isOffline, filteredFilm }) {
  
  return (
    <div className="main">
      
      { !isOffline ? <Connect /> : <FilmItem filteredFilm={ filteredFilm }/>}
    
    </div>
  );
}

export default App;
