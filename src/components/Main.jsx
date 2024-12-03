import React, { useState, useEffect } from "react";
import axios from "axios";
import requests from "../Requests";

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    axios.get(requests.requestPopular).then((response) => {
      setMovies(response.data.results);
      setSelectedMovie(
        response.data.results[
          Math.floor(Math.random() * response.data.results.length)
        ]
      );
    });
  }, []);

  const truncateString = (str, num) => {
    if (showFullText) {
      return str;
    }

    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  const handleReadMore = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className="w-full h-[550px] text-white">
      <div className="w-full h-full">
        <div className="absolute w-full h-[550px] bg-gradient-to-r from-black"></div>
        {selectedMovie && (
          <>
            <img
              className="w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/original/${selectedMovie?.backdrop_path}`}
              alt={selectedMovie?.title}
            />
            <div className="absolute w-full top-[20%] p-4 md:p-8">
              <h1 className="text-3xl md:text-5xl font-bold">
                {selectedMovie?.title}
              </h1>
              <div className="my-4">
                <button className="border bg-gray-300 text-black border-gray-300 py-2 px-5">
                  Play
                </button>
                <button className="border text-white border-gray-300 py-2 px-5 ml-4">
                  Watch Later
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                Released: {selectedMovie?.release_date}
              </p>
              <p className="w-full md:w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200">
                {truncateString(selectedMovie?.overview, 150)}
              </p>
              <button
                type="button"
                onClick={handleReadMore}
                className="text-white border border-gray-300 py-2 px-5 mt-4"
              >
                {showFullText ? "Show Less" : "Read More"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
