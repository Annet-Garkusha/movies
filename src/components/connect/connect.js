import React, { useState, useEffect } from "react";

import './connect.css'

import FilmItem from "../film-item/film-item";

function Connect() {
    const [isOffline, setIsOffline] = useState(false);
    function onOffline() {
      setIsOffline(true);
    }
    function onOnline() {
      setIsOffline(false);
    }
    useEffect(() => {
      window.addEventListener("offline", onOffline);
      window.addEventListener("online", onOnline);
      return () => {
        window.removeEventListener("offline", onOffline);
        window.removeEventListener("online", onOnline);
      };
    }, []);
    if (isOffline) {
      return <h1>Sorry, you are offline ...</h1>;
    }
    return <FilmItem />
  }

  export default Connect