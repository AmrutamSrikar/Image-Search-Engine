import React,{ useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Unsplash, { toJson } from "unsplash-js";
import axios from 'axios';
import  InfiniteScroll from "react-infinite-scroll-component";

// access key for unsplash api
const API_KEY = process.env.REACT_APP_API_KEY

// used functionality approach
const SearchPhotos = () => {

  // used hooks to store and manipulate the the data and histroy for routing(url changes)
    const [search, setQuery] = useState("");
    const [pics, setPics] = useState([]);
    let navigate = useNavigate();
    const unsplash = new Unsplash({
        accessKey: API_KEY,
      });
    const [initialLoading,setLoadingState]=useState(true);
    const [pageIndex,setPAgaeIndex]=useState(1);

    // used effect for (effects code based on set state condition)
    useEffect(()=> {
        initialLoadImages();
    },[initialLoading]);

     let initialLoadImages = async () => {
            // for first time we will get the photos randomly based on flag condition
            if(initialLoading) {
              await axios.get('https://api.unsplash.com/photos', {
                headers: {
                    Authorization: `Client-ID ${API_KEY}`
                }
            }).then((json => {
                setPics([...pics,...json.data]);
                })).catch(error => {
                    console.log(error);
                });
        } 
        // on the change in scroll effect will get the data from the next page of unsplash photos.
        else {
              setPAgaeIndex(pageIndex+1);
              let url = `https://api.unsplash.com/search/photos?query=${search}&per_page=20&page=${pageIndex}`;
              await axios.get(url, {
                headers: {
                    Authorization: `Client-ID ${API_KEY}`
                }
              })
              .then(toJson)
              .then((json) => {
              setPics([...pics,...json.data.results]);
              }).catch((error)=>alert(error));
        }
     }
       
    // on search engine to get the photos of entered photo name.
    const searchPhotos = async (e) => {
        setLoadingState(false);
        setPics([]);
        unsplash.search
        .photos(search,1,30,2)
        .then(toJson)
        .then((json) => {
        setPics(json.results);
        navigate("?search="+search);
        }).catch((error)=>alert(error));
        e.preventDefault();
      };
    console.log(search);

    
      

    // rendering the component
  return (
    <>
         <div>
          <form className="form" onSubmit={searchPhotos}> 
                  <input
                    type="text"
                    name="search"
                    className="input"
                    placeholder={`Search your images`}
                    value={search}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button type="submit" className="button">
                        <svg width="30" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.3611 15.2778H16.2639L15.875 14.9028C17.2832 13.2695 18.0571 11.1843 18.0556 9.02778C18.0556 7.24226 17.5261 5.49683 16.5341 4.01222C15.5421 2.52761 14.1322 1.37049 12.4826 0.687203C10.833 0.0039116 9.01777 -0.174869 7.26655 0.17347C5.51533 0.521809 3.90674 1.38162 2.64418 2.64418C1.38162 3.90674 0.521809 5.51533 0.17347 7.26655C-0.174869 9.01777 0.0039116 10.833 0.687203 12.4826C1.37049 14.1322 2.52761 15.5421 4.01222 16.5341C5.49683 17.5261 7.24226 18.0556 9.02778 18.0556C11.2639 18.0556 13.3194 17.2361 14.9028 15.875L15.2778 16.2639V17.3611L22.2222 24.2917L24.2917 22.2222L17.3611 15.2778ZM9.02778 15.2778C5.56945 15.2778 2.77778 12.4861 2.77778 9.02778C2.77778 5.56945 5.56945 2.77778 9.02778 2.77778C12.4861 2.77778 15.2778 5.56945 15.2778 9.02778C15.2778 12.4861 12.4861 15.2778 9.02778 15.2778Z" fill="#303030"/>
                        </svg>
                        
                  </button>
          </form>
          </div>
          <div>
            {/* used infinite scroll libirary */}
        {pics.length === 0 ? <p>No results Found </p> :
          <InfiniteScroll dataLength={pics.length} loader={<h4>Loading...</h4>} 
            next={initialLoadImages} hasMore={true}>
                <div className="card-list">
                  {pics.map((pic,index) =>
                    <div className="card" key={pic.id+index}>
                      <img
                        className="card--image"
                        alt={pic.alt_description}
                        src={pic.urls.thumb}
                        width="100%"
                        height="50%"
                      ></img>
                    </div>)};
                </div>
          </InfiniteScroll>}
          </div>
    </>
  );
}

export default SearchPhotos;
