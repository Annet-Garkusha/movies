import React, {Component} from 'react';

import { format } from 'date-fns';
import { Rate } from 'antd';

import './one-movie.css';

export default class OneMovie extends Component {

    onHandleChangeRate = (value) => {
        const { id , onStarChange } = this.props
       
       onStarChange(id, value)
    }
    
    onStarSave = (movieId) => {
        const { getRatedMovie } = this.props
        const movie = getRatedMovie()
        if(movie !== undefined && movie.hasOwnProperty(movieId)) {
            return movie[movieId].rate
        }
    }
    render() {
        const { poster_path, original_title, release_date, overview, id, vote_average, genres } = this.props;
        const rate = this.onStarSave(id)

        let newText = '';
        if(overview.length > 150) {
            newText = overview.slice(0, 150)
            let lastIndex = newText.lastIndexOf(' ')
            newText = newText.slice(0, lastIndex) + '...' 
        }
        else newText = overview + '...'
        const date = release_date ? format( new Date(release_date), "MMMM dd, yyyy") : <span>Data</span>
        
        const genresNames = genres?.map((genre) => {
            return genre.name;
          });
          
    
        return(
            <div className="rate-wrapper" key={ id }>
                {
                  poster_path === null ? <img src={'https://st2.depositphotos.com/1526816/6758/v/600/depositphotos_67585141-stock-illustration-oops.jpg'} alt='Logo'></img>
                  : <img src={`https://image.tmdb.org/t/p/w500/${ poster_path }`} alt='Logo'></img>
                }
                <div className="content">
                <h5>{ original_title }</h5>
                { vote_average > 0 && vote_average <= 3 ? <div className="vote-average-1" >{ vote_average }</div> : null}
                { vote_average > 3 && vote_average <= 5 ? <div className="vote-average-2" >{ vote_average }</div> : null }
                { vote_average > 5 && vote_average <= 7 ? <div className="vote-average-3" >{ vote_average }</div> : null }
                { vote_average > 7 ? <div className="vote-average-4" >{ vote_average }</div> : null }
                <div className="data">{ date }</div>

                { genresNames.map((genre, index) => {
                    if ( genre !== undefined) {
                        return (
                            <li key={ index }>{ genre }</li>
                        )
                    }
                })}
                
                <div>
                    <p>{ newText }</p>
                </div>
                <div >
                <Rate className="movie-rate" style={{ fontSize: 15 }} count={ 10 } onChange={ this.onHandleChangeRate } value={ rate }/>
                </div>
                </div>
            </div>
         )
    }
    
    }
    
    