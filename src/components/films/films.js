import React, { Component } from 'react';
import 'antd/dist/antd.min.css';
import axios from 'axios';
import { Alert, Pagination, Tabs } from 'antd';

import './films.css';

import Spinner from '../spinner/spinner';
import ErrorIndicator from '../error-indicator/error-indicator';
import SearchInput from '../searchInput/search-input';
import CardFilm from '../card-film/card-film';
import RatedMovie from '../rated-movie/rated-movie';
import { Provider } from '../context/context';

export default class FilmItem extends Component {
  state = {
    movies: [],
    loading: true,
    error: false,
    query: 'return',
    total: null,
    page: null,
    vote_average: null,
    genres: null,
  };

  genresMovie = async () => {
    const { data } = await axios.get(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=5ca9351192cf8dad1d64a9603a0a46bb&language=en-US'
    );
    return data;
  };
  componentDidMount() {
    this.genresMovie()
      .then((resp) => {
        this.setState({ genres: resp.genres });
      })
      .catch(this.onError);
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, page, vote_average } = this.state;

    if (
      this.state.query !== prevState.query ||
      this.state.page !== prevState.page ||
      this.state.genres !== prevState.genres
    ) {
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=5ca9351192cf8dad1d64a9603a0a46bb&query=${query}&page=${page}`
      )
        .then((resp) => {
          if (resp.status > 400) {
            return this.onError();
          }
          return resp.json();
        })
        .then((rez) =>
          this.setState({ movies: rez.results, loading: false, total: rez.total_results, page, vote_average })
        )
        .catch(this.onError);
    }
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onUpdateInput = (text) => {
    this.setState(() => {
      return { query: text };
    });
    this.genresMovie().then((resp) => {
      this.setState({ genres: resp.genres });
    });
  };

  onChangePage = (count) => {
    this.setState(() => {
      return { page: count };
    });
    this.genresMovie().then((resp) => {
      this.setState({ genres: resp.genres });
    });
  };

  onStarChange = async (id, rate) => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}}?api_key=5ca9351192cf8dad1d64a9603a0a46bb`
    );
    if (localStorage.getItem('selectedMovies') === null) {
      const movies = JSON.stringify([]);
      localStorage.setItem('selectedMovies', movies);
    }

    const movies = JSON.parse(localStorage.getItem('selectedMovies'));
    let newMovies = {
      ...movies,
      [data.id]: {
        data,
        rate,
      },
    };
    localStorage.removeItem('selectedMovies');
    newMovies = JSON.stringify(newMovies);
    localStorage.setItem('selectedMovies', newMovies);
  };

  render() {
    const { loading, error, movies, total, genres } = this.state;
    const { TabPane } = Tabs;

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;

    const search =
      total === 0 ? (
        <Alert style={{ margin: '0 auto', fontSize: '16px' }} message="Nothing found for your request" />
      ) : null;

    return (
      <Provider value={genres}>
        <Tabs defaultActiveKey="1" centered destroyInactiveTabPane>
          <TabPane tab="Search" key="1">
            <SearchInput onUpdateInput={(val) => this.onUpdateInput(val)} />
            <div className="card">
              {errorMessage}
              {spinner}
              {movies.map((movie) => (
                <CardFilm {...movie} onStarChange={this.onStarChange} key={movie.id} genres={genres} />
              ))}
              {search}
            </div>
            <Pagination
              total={total}
              showSizeChanger={false}
              style={{ display: 'flex', justifyContent: 'center' }}
              onChange={(e) => this.onChangePage(e)}
              defaultPageSize={20}
            />
          </TabPane>
          <TabPane tab="Rated" key="2">
            <div className="movie">
              <RatedMovie genres={genres} />
            </div>
          </TabPane>
        </Tabs>
      </Provider>
    );
  }
}
