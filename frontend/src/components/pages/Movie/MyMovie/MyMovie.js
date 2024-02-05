import styles from './MyMovie.module.css';
import { useState, useEffect } from 'react';
import RoundedImage from '../../../layouts/RoundedImage/RoundedImage';
import api from '../../../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
/*Hooks */
import useFlashMessage from '../../../../hooks/useFlashMessage';

const MyMovie = () => {
    const [movies, setMovies] = useState([]);
    const [token] = useState(localStorage.getItem("token") || "");
    const { setFlashMessage } = useFlashMessage();
    const navigate = useNavigate();

    // //criar uma constante com o cabeçalho para reaproveita-lo;
    // const Header = {
    //     headers:{
    //         Authorization:`Bearer ${JSON.parse(token)}`,
    //         "Content-Type":"multipart/form-data"
    //     }
    // }
    //usar useEffect para retornar o dados dos filmes do usuario
    useEffect(() => {
        api.get('/movies/mymovies', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                setMovies(response.data.movies);
            })
            .catch((error) => {
                return error.response.data;
            })
    }, [token])
    // console.log(movies)


    //remover um filme
    async function removeMovie(id) {
        let msgType = 'success';
        const data = await api.delete(`/movies/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                const updateMovies = movies.filter((movie) => movie._id !== id);
                setMovies(updateMovies);
                return response.data;
            })
            .catch((error) => {
                msgType = 'error'
            })
        setFlashMessage(data.message, msgType)
    }
    return (
        <section>
            
            <div className={styles.mymovie_header}>
                
                <h1>Meus Filmes</h1>
                <Link to="/movie/add">Cadastrar Filmes</Link>
            </div>
            <div className={styles.mymovie_container}>
                {movies.length > 0 && movies.map((movie) => (
                    <div className={styles.mymovie_row} key={movie._id}>
                        <Link to={`/movie/${movie._id}`}>
                            <RoundedImage
                                src={`${process.env.REACT_APP_API}/images/movies/${movie.images[0]}`}
                                alt={movie.title}
                                width="w75"
                            />
                        </Link>
                        <p>Filme: <span className='bold'>{movie.title}</span></p>
                        <div className={styles.actions}>
                            <Link to={`/movie/edit/${movie._id}`}>Editar</Link>
                            <button onClick={() => { removeMovie(movie._id) }}>Excluir</button>
                        </div>
                    </div>
                ))}
                {movies.length === 0 && <p>Não há filmes cadastrados!</p>}
            </div>
        </section>
    )
}

export default MyMovie