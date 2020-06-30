import React, { useEffect, useState } from 'react';
import './home.css';
import LineChart from './line-chart';
import {setLocalStorage, getLocalStorage, removeLocalStorage, getIntLocalStorage} from '../../bussiness-logic/common';

// eslint-disable-next-line no-unused-vars
let loader;
let loaded = false;
let itemsExist = [];
let isItemsExist = false;
// // hide loader
// const showLoader = () => loaded && loader ? loader.classList.remove('loader--hide') : null;
// // show loader
// const hideLoader = () => loaded && loader ? loader.classList.add('loader--hide') : null;
function Home() {
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState(itemsExist);
  const [page, setPage] = useState(0);
  const [nbPages, setMaxPage] = useState(null || 100);

    // loader selector from DOM
    if(loaded){
      loader = document.querySelector('.loader');
    }
    
  // Method hides the on click of hide in table WRT stories
  const onHide = rowId => {
    let updatedItems = items.filter( item => item.objectID !== rowId.toString());
    setItems(updatedItems);
    removeLocalStorage(`page${page}`);
    setLocalStorage(`page${page}`, updatedItems);
  };
// Method updates the up votes on click of upvote in table WRT stories
  const handleUpvote = rowId => {
    let updatedItems = items.map( item => {
      if (item.objectID === rowId.toString()) {
        item.points++;
      }
      return item;
    });
    setItems(updatedItems);
    removeLocalStorage(`page${page}`);
    setLocalStorage(`page${page}`, updatedItems);
  };


  // get news stories call using fetch details from API
  const getNewsStory = page => {
    // showLoader();
    if(page < 0 || page > nbPages){
      alert('Currently there is no previous page');
      return;
    }
    let itemsPageExist = getLocalStorage(`page${page}`);
    if(itemsPageExist && itemsPageExist.length){
      setItems(itemsPageExist);
      setPage(page);
      setLocalStorage('currentActivePage', page);
    } else if(page >= 0 ){
    fetch(`https://hn.algolia.com/api/v1/search?tags=story&page=${page}&hitsPerPage=10`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          // hideLoader();
          setItems(result.hits);
          setPage(result.page);
          setMaxPage(result.nbPages);
          removeLocalStorage(`page${page}`);
          setLocalStorage(`page${page}`, result.hits);
          setLocalStorage('currentActivePage', page);
          isItemsExist = true;
        },
        (error) => {
          setIsLoaded(true);
          // hideLoader();
          setError(error);
        }
      )
    }
  };

  const redirectToNews = url => {
    window.location.href = url;
  };
  useEffect(() => {
    loaded = true;
    let activePage = getIntLocalStorage('currentActivePage');
    itemsExist = getLocalStorage(`page${activePage || page}`);
    if(!isItemsExist && itemsExist && itemsExist.length === 0){
      getNewsStory(activePage || page)
    } else if(itemsExist && itemsExist.length) {
        setItems(itemsExist);
        setPage(activePage || page);
    } 
  },[])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div className="container">
        <div className="table-responsive">
      <table className="table table-striped">
      <caption className='caption-text'>Hacker news stories listed in table with upvotes and links to stories, can upvote news stories, hide, read news by opening and compare votes line chart.</caption>
        <thead className='table-header'>
          <tr cope="row">
            <th scope="col" >Comments</th>
            <th scope="col">Vote Count</th>
            <th scope="col">UpVote</th>
            <th scope="col">News Details</th>
          </tr>
        </thead>
        <tbody>
          {items && items.map(item =>
            (
          <tr key={item.objectID}>
            <td>{item.num_comments}</td>
            <td>{item.points}</td>
            <td><span className='upvote ' onClick={() => handleUpvote(item.objectID)}>
              <i className="fa fa-sort-up fo-size"></i></span></td>
            <td>
              <span className='open-news' onClick={() => redirectToNews(item.url)}>
              {`${item.title}`}<span className='grey-out'> {`(${item.url})`}
               </span> by {`${item.author}`} <span className='grey-out'>
                 {`${new Date(item.created_at).getHours()} hours ago`}</span>
              </span>[{ <span className='open-news-hide' 
              onClick={() => onHide(item.objectID)}>hide</span>}]
            </td>
          </tr>)
          )}
        </tbody>
      </table>
      </div>
      <div className='peg-prev-next'>
      <span className="peg-prev" onClick={() => getNewsStory(page - 1)} >Previous</span>
      <span className="peg-delim">|</span>
      
      <span className="peg-next" onClick={() => getNewsStory(page + 1)}>Next</span>
      </div>
      <hr />
      <LineChart  data={items}/>
      <hr />
    </div>
    );
  }
}

export default Home;
