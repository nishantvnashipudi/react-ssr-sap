import React, { useEffect, useState } from 'react';
import './home.css';
import LineChart from './line-chart';

let loader;
let loaded = false;
// hide loader
const showLoader = () => loaded && loader ? loader.classList.remove('loader--hide') : null;
// show loader
const hideLoader = () => loaded && loader ? loader.classList.add('loader--hide') : null;
function Home() {
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsFromStorage = loaded ? JSON.parse(localStorage.getItem('items')) : [];
  let itemsArray = itemsFromStorage ? itemsFromStorage : [];
  const [items, setItems] = useState(itemsArray);
  const [page, setPage] = useState(0);
  const [nbPages, setMaxPage] = useState(null);

    // loader selector from DOM
    if(loaded){
      loader = document.querySelector('.loader');
    }
    
  // Method hides the on click of hide in table WRT stories
  const onHide = rowId => {
    let updatedItems = items.filter( item => item.objectID !== rowId.toString());
    setItems(updatedItems);
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
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };


  // get news stories call using fetch details from API
  const getNewsStory = pg => {
    showLoader();
    fetch(`https://hn.algolia.com/api/v1/search?tags=story&page=${pg}&hitsPerPage=10`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          hideLoader();
          setItems(result.hits);
          setPage(result.page);
          setMaxPage(result.nbPages);
          localStorage.removeItem('items', JSON.stringify(result.hits));
          localStorage.setItem('items', JSON.stringify(result.hits));
        },
        (error) => {
          setIsLoaded(true);
          hideLoader();
          setError(error);
        }
      )
  };

  const redirectToNews = url => {
    window.location.href = url;
  };
  useEffect(() => {
    loaded = true;
    getNewsStory(0)
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div className="container">
        <div class="table-responsive">
      <table class="table table-striped">
        <thead className='table-header'>
          <tr>
            <th>Comments</th>
            <th>Vote Count</th>
            <th>UpVote</th>
            <th>News Details</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item =>
            (
          <tr key={item.objectID}>
            <td>{item.num_comments}</td>
            <td>{item.points}</td>
            <td><span className='upvote' onClick={() => handleUpvote(item.objectID)}>Upvote</span></td>
            <td>
              <span className='open-news' onClick={() => redirectToNews(item.url)}>
              {`${item.title} (${item.url}) by ${item.author} ${new Date(item.created_at).getHours()} hours ago`}
              </span>[{ <span className='open-news' onClick={() => onHide(item.objectID)}>hide</span>}]
            </td>
          </tr>)
          )}
        </tbody>
      </table>
      </div>
      <div className='peg-prev-next'>
      <span className="peg-prev" onClick={() => getNewsStory(page - 1)} disabled={page < 1}>Previous</span>
      <span className="peg-delim">|</span>
      
      <span className="peg-next" onClick={() => getNewsStory(page + 1)} disabled={page > nbPages}>Next</span>
      </div>
      <hr />
      <LineChart  data={items}/>
      <hr />
    </div>
    );
  }
}

export default Home;
