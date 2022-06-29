import React, { Component } from "react";
import 'antd/dist/antd.min.css';
import axios from "axios";

import Spinner from "../spinner/spinner";

import './films.css';
import ErrorIndicator from "../error-indicator/error-indicator";
import SearchInput from "../searchInput/search-input";
import CardFilm from "../card-film/card-film";
import RatedMovie from "../rated-movie/rated-movie";
import { Alert, Pagination, Tabs } from "antd";
import { Provider } from "../context/context";


export default class FilmItem extends Component {

    state = {
        movies: [],
        loading: true,
        error: false,
        query: 'return',
        total: null,
        page: null,
        vote_average: null,
        genres: null
    
      };

      fetchMovie = async () => {
        try {
          const { data } = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=5ca9351192cf8dad1d64a9603a0a46bb&query=${this.state.query}&page=${this.state.page}`
          );
          this.setState({ error: false, loading: false})
          return data;
        } catch (err) {
            this.onError();
        } 
      };
      genresMovie = async () => {
        const { data } = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list?api_key=5ca9351192cf8dad1d64a9603a0a46bb&language=en-US'
        );
        return data;
      };
    componentDidMount() {
        const { page } = this.state

        setTimeout(() => {
            this.fetchMovie().then((rez) => {
                this.setState({ movies: rez.results, loading: false, total: rez.total_results, page, genres: rez.genres})
            
            });
          }, 1000);
          this.genresMovie().then((resp) => {
            this.setState({ genres: resp.genres})
          }); 
        
        // fetch(`https://api.themoviedb.org/3/search/movie?api_key=5ca9351192cf8dad1d64a9603a0a46bb&query=return&page=${ page }`)
        //     .then((response) => {
        //         if(response.status > 400) {
        //             return this.onError()
        //         }
        //         return response.json()
        //     })
        //     .then((rez) => this.setState({ movies: rez.results, loading: false, total: rez.total_results, page, genres: rez.genres}))
        //     .catch(this.onError)

        // fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=5ca9351192cf8dad1d64a9603a0a46bb&language=en-US')
        //     .then((data)=> data.json())
        //     .then( (resp) => this.setState({ genres: resp.genres}))
        
     }

    
     componentDidUpdate(prevProps, prevState) {
        const { query, page, vote_average } = this.state
        
        if( this.state.query !== prevState.query || this.state.page !== prevState.page || this.state.genres !== prevState.genres ) {
            // setTimeout(() => {
            //     this.fetchMovie().then((rez) => {
            //         this.setState({ movies: rez.results, loading: false, total: rez.total_results, page, genres: rez.genres})
                
            //     });
            //   }, 1000);
            //   this.genresMovie().then((resp) => {
            //     this.setState({ genres: resp.genres})
            //   });
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=5ca9351192cf8dad1d64a9603a0a46bb&query=${query}&page=${ page }`)
            .then((resp) => resp.json())
            .then((rez) => this.setState({ movies: rez.results, loading: false , total: rez.total_results, page, vote_average }))
            .catch(this.onError)
        // fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=5ca9351192cf8dad1d64a9603a0a46bb&language=en-US')
        // .then((data)=> data.json())
        // .then( (resp) => this.setState({ genres: resp.genres}))
        
        }
    
     }
 
    onError =  (err) => {
         this.setState({
             error: true,
             loading: false
         })
    }

    onUpdateInput = (text) => {
        this.setState(({ query }) => {
           return { query: text }
        })
    }

    onChangePage = (count) => {
        this.setState(({ page }) => {
            return { page: count }
         })
    }

    onStarChange =  async (id, rate) => {
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}}?api_key=5ca9351192cf8dad1d64a9603a0a46bb`);
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
    }

    render() {
        const { loading, error, movies, total, genres } = this.state
        const { TabPane } = Tabs;
     
        const errorMessage = error ? <ErrorIndicator /> : null
        const spinner = loading ? <Spinner /> : null
        
        const search = total === 0 ? <Alert style={{margin:'0 auto', fontSize:'16px'}} message="Nothing found for your request" /> : null

        const newGeneres = genres?.map((el) => el)
       
       return (
        <Provider value={ genres }>
        <Tabs defaultActiveKey="1" centered destroyInactiveTabPane>
           <TabPane tab="Search" key="1">
           <SearchInput
                onUpdateInput={ (val) => this.onUpdateInput(val) }
            /> 
             <div className="card">
             { spinner }
            { errorMessage }
            { movies.map(movie => ( <CardFilm {...movie} onStarChange={ this.onStarChange } key={ movie.id } genres={ newGeneres } />)) }
            { search }
           </div>
           <Pagination total={ total }
           showSizeChanger={ false }
           style={{ display:'flex', justifyContent: 'center'}}
           onChange={ (e) => this.onChangePage(e)}
           defaultPageSize={ 20 }
           />
            </TabPane>
            <TabPane tab="Rated" key="2">
                <div className="movie">
                <RatedMovie genres={ genres }/>
                </div>
            </TabPane>
        </Tabs>
        </Provider>
           
       ) 
    }
}
