import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import axios from "axios";

const Movie = ({ item }) => {
  const [like, setLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const { user } = UserAuth();

  const saveShow = async () => {
    if (user?.email) {
      setLike(!like);
      setSaved(true);
      const movieID = doc(db, "users", `${user?.email}`);
      await updateDoc(movieID, {
        savedShows: arrayUnion({
          id: item.id,
          title: item.title,
          img: item.backdrop_path,
        }),
      });
    } else {
      alert("Please log in to save a movie");
    }
  };

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${item.id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=videos`
      );
      const movie = response.data;
      const trailer = movie.videos.results.find(
        (video) => video.type === "Trailer"
      );
      setMovieDetails({ ...movie, trailer: trailer?.key });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  return (
    <>
      <div
        key={item.id}
        className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2"
        onClick={fetchMovieDetails}
      >
        <img
          className="w-full h-auto block"
          src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
          alt={item?.title}
        />
        <div
          className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100
               text-white"
        >
          <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
            {item?.title}
          </p>
          <p onClick={saveShow}>
            {like ? (
              <FaHeart className="absolute top-4 left-4 text-gray-300" />
            ) : (
              <FaRegHeart className="absolute top-4 left-4 text-gray-300" />
            )}
          </p>
        </div>
      </div>
      {movieDetails && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{movieDetails.title}</h2>
          <p className="mb-4">{movieDetails.overview}</p>
          {movieDetails.trailer && (
            <div className="relative pb-9/16">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${movieDetails.trailer}`}
                allowFullScreen
                title="Trailer"
              ></iframe>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Movie;
