import React, { useState } from "react";
import './style.css'


const App = () => {

  const [query, setQuery] = useState('')

  // Defining the button handler 1
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("This happened: ", event.target);
    console.log("id: ", query);

    GetMovieData(query);
  };

  // Defining  button handler 2
  const handleClick = (event) => {
    event.preventDefault();
    console.log("This happened: ", event.target);

    GetMovieData(query);
  };

  const [results, setResults] = useState([])

  const GetMovieData = async (query) => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies?search=${query}`);
      const data = await response.json();
      console.log(data);
      const items = data.map((item) => ({ ...item, showMoreData: false }));
  
      if (query) {
        const queryLower = query.toLowerCase();
        const filteredItems = items.filter(
          (item) =>
            item.title.toLowerCase().includes(queryLower) ||
            item._id.toLowerCase().includes(queryLower)
        );
        if (filteredItems.length > 0) {
          setResults(filteredItems);
        } else {
          setResults([]);
        }
      } else {
        setResults(items);
      }
    } catch (error) {
      console.error(error);
    }
  };

//Modifying movies
const modifyMovie = async () => {
  console.log("Query: " + query);
  // calls the API to make a PUT request (to modify a movie)
  try {
    const response = await fetch(`http://localhost:8080/api/modify/${query}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to modify the movie."); // Throw an error if the response is not successful
    }

    const data = await response.json();
    console.log("Results: ", data);
    const items = data;
    console.log("One movie: ", data);

    setResults(items);
  } catch (error) {
    console.error(error);
  }
};


  //Array for the movie
  const MovieArray = (props) => {
    const { data } = props;
    // Movie image
    let posterImg;

    // Check poster
    const CheckPoster = (props) => {
      let poster = props.src;
      // If movie poster doesn't exist
      if (poster === "" || poster === null) {
        posterImg = "https://openvirtualworlds.org/omeka/files/fullsize/1/30/movie-big.jpg";
      } else {
        posterImg = poster;
      }
      // Return movie img
      return (
        <img
          src={posterImg}
          alt="Poster"
          className="img-thumbnail"
          
          onError={(e) => { e.target.onerror = null; e.target.src = "https://openvirtualworlds.org/omeka/files/fullsize/1/30/movie-big.jpg" }}
          width="50%"
        />
      );
    };

    //Making table for the movies
    return (
      <div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr key={props.id}>
              <th scope="col">Title</th>
              <th scope="col">Year</th>
              <th scope="col">Directors</th>
              <th scope="col">Rating</th>
              <th scope="col">Poster</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr>
                <td key={i}> {item.title}</td>
                <td> {item.year} </td>
                <td> {item.directors} </td>
                <td> {item.imdb.rating}</td>
                {/*  Create image*/}
                <td id="pic">
                  <CheckPoster src={item.poster} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  // Return for the form
  return (
    <div>
      <h1>Find or modify movies</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Search/set: </label>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="form-control"
              placeholder="Set id: "
              name="query"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>

            <button
              type="button"
              className="btn"
              onClick={handleClick}
            >
              Search all
            </button>
            <button
              type="button"
              className="btn"
              onClick={modifyMovie}
            >
              Modify movie
            </button>
          </div>
        </form>
      </div>
      <MovieArray data={results} />
    </div>
  );
};

export default App;