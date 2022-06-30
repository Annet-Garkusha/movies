import React from 'react';

import OneMovie from '../one-movie/one-movie';

const RatedMovie = () => {
  const [rateMovie, setRateMovie] = React.useState([]);

  const getRatedMovie = () => {
    if (localStorage.getItem('selectedMovies') === null) {
      throw new Error('Error');
    }

    const getMovies = JSON.parse(localStorage.getItem('selectedMovies'));
    return getMovies;
  };

  React.useEffect(() => {
    try {
      const film = getRatedMovie();
      setRateMovie(Object.values(film));
    } catch (Error) {
      throw new Error('Error');
    }
  }, []);
  return (
    <>
      {rateMovie.map((el) => (
        <OneMovie {...el.data} getRatedMovie={getRatedMovie} key={el.data.id} genres={el.data.genres} />
      ))}
    </>
  );
};

export default RatedMovie;
