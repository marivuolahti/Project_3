import React, { useState } from 'react';
import './style.css'

const App = () => {
    const [query, setQuery] = useState(' ')

    //Defining button handler
    const SubmitHandling = (event) => {
    event.preventDefault();
    console.log("This happened: ", event.target);
    console.log("id: ", query);
    
    GetMovieData();
    };
    //For the second button handler
    const handleClick = (event) => {
        event.preventDefault();
        console.log("This happened: ", event.target);
    
    GetMovieData();
    };

    const [results, setResults] = useState([])

    const GetMovieData = () => {
        fetch("http://localhost:5000/api/movies")
        .then((results) =>{
            return results.json();
        })
        .then((data) => {
            console.log(data);
            const items = data;

            setResults(items);
        });
    };

};
 //ADD COMMENTS

// Modifying movies
const ModifyMovie = () => {
    console.log("Query; " + query)
    fetch("https://localhost:5000/api/modify/" + query, {
        method: 'PUT'
    })
    .then((results) => {
    return results.json();
    })
    .then((data) => {
        console.log("Results: ", data);
        const items = data;
        console.log("One movie: ", data);

        setResults(items)
    });
};
// Array for the movies

const MovieArray = (props) => {
    const { data } = props;

    //Movie image
    let posterImg;
    //Checking the poster
    const CheckPoster = (props) => {
        let poster = poster.src; 
    // In case movie don't exist
    if (poster === "" || poster === null || typeof poster === 'undefined') {
        posterImg = "https://openvirtualwords.org/omeka/files/fullsize/1/30/movie-big.jpg"
    } else {
        posterImg = poster;
    }
    //return movie img
    return (
        <img
          src={posterImg}
          alt="Poster"
          className="img-thumbnail"
          
          onError={(e) => { e.target.onerror = null; e.target.src = "https://openvirtualworlds.org/omeka/files/fullsize/1/30/movie-big.jpg" }}
          width="50%"
        />
      );
    }
}
           
