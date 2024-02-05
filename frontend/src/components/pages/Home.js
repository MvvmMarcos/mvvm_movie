import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  useEffect(()=>{
    api.get("/movies/")
    .then((response)=>{
      setMovies(response.data.movies)
    })
    .catch((error)=>{
      return error.response.data;
    })
  },[])
console.log(movies);
  return (
    <section>
      <div className={styles.home_header}>
        <h1>Todos os filmes registrados</h1>
      </div>
      <div className={styles.home_container}>
    {movies.length > 0 && (
      movies.map((movie)=>(
        <div className={styles.movie_card}>
          <div style={{backgroundImage:`url(${process.env.REACT_APP_API}/images/movies/${movie.images[0]})`}}
          className={styles.movie_card_image}
          ></div>
          <p className={styles.rating}><i class="fa-solid fa-star"></i>{movie.average}</p>
           <h3>{movie.title}</h3>
          <p><Link to={`movie/${movie._id}`}>Detalhes</Link></p>
        </div>
      ))
    )}
      </div>
    </section>
  )
}

export default Home