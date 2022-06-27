import React, { Component } from "react";
import 'antd/dist/antd.min.css';
import { format } from 'date-fns';

import Spinner from "../spinner/spinner";

import './film-item.css';
import ErrorIndicator from "../error-indicator/error-indicator";
import SearchInput from "../searchInput/search-input";
import { Alert, Pagination, Rate, Tabs } from "antd";
import { id } from "date-fns/locale";

export default class FilmItem extends Component {

    state = {
        movies: [],
        loading: true,
        error: false,
        query: 'return',
        total: null,
        page: null,
        vote_average: null,
    
      };
      
    componentDidMount() {
        const { page } = this.state
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=5ca9351192cf8dad1d64a9603a0a46bb&query=return&page=${ page }`)
            .then((response) => {
                if(response.status > 400) {
                    return this.onError()
                }
                return response.json()
            })
            .then((rez) => this.setState({ movies: rez.results, loading: false, total: rez.total_results, page}))
            
            .catch(this.onError)
                      
     }
    
     componentDidUpdate(prevProps, prevState) {
        const { query, page, vote_average } = this.state
        if( this.state.query !== prevState.query || this.state.page !== prevState.page ) {
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=5ca9351192cf8dad1d64a9603a0a46bb&query=${query}&page=${ page }`)
            .then((resp) => resp.json())
            .then((rez) => this.setState({ movies: rez.results, loading: false , total: rez.total_results, page, vote_average}))
            .catch(this.onError)
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
    

    newCard(movie) {
        const { poster_path, original_title, release_date, overview, id, vote_average } = movie;
        
        let newText = '';
        if(overview.length > 150) {
            newText = overview.slice(0, 150)
            let lastIndex = newText.lastIndexOf(' ')
            newText = newText.slice(0, lastIndex) + '...' 
        }
        else newText = overview + '...'
        const date = release_date ? format( new Date(release_date), "MMMM dd, yyyy") : <span>Data</span>
        return(
            <div className="wrapper" key={ id }>
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
                <div>
                    <span>Action</span>
                    <span>Drama</span>
                </div>
                <div>
                    <p>{ newText }</p>
                </div>
                <div >
                <Rate defaultValue={0} style={{ fontSize: 15 }} count={ 10 } onChange={ this.onHandleChangeRate }/>
                </div>
                </div>
            </div>
         )
    }


    render() {
        const { loading, error, movies, total } = this.state
        const { TabPane } = Tabs;
        
        const hasData = !(loading || error)
        const errorMessage = error ? <ErrorIndicator /> : null
        const spinner = loading ? <Spinner /> : null
        const content = hasData ? movies.map(movie =>  this.newCard(movie)) : null
        const search = total === 0 ? <Alert style={{margin:'0 auto', fontSize:'16px'}} message="Nothing found for your request" /> : null
       return (
           <>
        <Tabs defaultActiveKey="1" centered destroyInactiveTabPane>
           <TabPane tab="Search" key="1">
           <SearchInput
                onUpdateInput={ (val) => this.onUpdateInput(val) }
            /> 
             <div className="card">
            { errorMessage }
            { spinner }
            { content }
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
            Content of Tab Pane 2
            </TabPane>
        </Tabs>
           </>
       ) 
    }
}
