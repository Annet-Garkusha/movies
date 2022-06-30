/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import '../one-movie/one-movie.css';
import './card-film.css';

export default class CardFilm extends Component {
  state = {
    test: [],
  };

  genresNames() {
    const genresMovie = this.props.genres?.map((genre) => {
      if (this.props.genre_ids.includes(genre.id)) {
        return genre.name;
      }
    });

    this.setState({ test: genresMovie });
  }

  onHandleChangeRate = (value) => {
    const { id, onStarChange } = this.props;

    onStarChange(id, value);
  };

  componentDidMount() {
    this.genresNames();
  }

  render() {
    const { poster_path, original_title, release_date, overview, id, vote_average } = this.props;

    let newText = '';
    if (overview.length > 150) {
      newText = overview.slice(0, 150);
      let lastIndex = newText.lastIndexOf(' ');
      newText = newText.slice(0, lastIndex) + '...';
    } else newText = overview + '...';
    const date = release_date ? format(new Date(release_date), 'MMMM dd, yyyy') : <span>Data</span>;

    return (
      <div className="wrapper" key={id}>
        {poster_path === null ? (
          <img
            src={'https://st2.depositphotos.com/1526816/6758/v/600/depositphotos_67585141-stock-illustration-oops.jpg'}
            alt="Logo"
          ></img>
        ) : (
          <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt="Logo"></img>
        )}
        <div className="content">
          <h5>{original_title}</h5>
          {vote_average > 0 && vote_average <= 3 ? <div className="vote-average-1">{vote_average}</div> : null}
          {vote_average > 3 && vote_average <= 5 ? <div className="vote-average-2">{vote_average}</div> : null}
          {vote_average > 5 && vote_average <= 7 ? <div className="vote-average-3">{vote_average}</div> : null}
          {vote_average > 7 ? <div className="vote-average-4">{vote_average}</div> : null}
          <div className="data">{date}</div>
          {this.state.test?.map((genre, index) => {
            if (genre !== undefined) {
              return (
                <li className="genres" key={index}>
                  {genre}
                </li>
              );
            }
          })}

          <div>
            <p>{newText}</p>
          </div>
          <div>
            <Rate className="movie-rate" style={{ fontSize: 15 }} count={10} onChange={this.onHandleChangeRate} />
          </div>
        </div>
      </div>
    );
  }
}
