import styles from './EditMovie.module.css';
import api from '../../../../utils/api';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
/*Hooks */
import useFlashMessage from '../../../../hooks/useFlashMessage';
/*Components */
import MovieForm from '../../../form/MovieForm';


const EditMovie = () => {
    const {id} = useParams();
    const [movie, setMovie] = useState({})
    const [token] = useState(localStorage.getItem('token') || '');
    const { setFlashMessage } = useFlashMessage();
    //navigate
    const navigate = useNavigate();
    //useEffect para trazer os dados do filme acessando a api
    useEffect(() => {
        api.get(`/movies/${id}`, {
            Authorization: `Barer ${JSON.parse(token)}`
        })
            .then((response) => {
                setMovie(response.data.movie);
            })
            .catch((error) => {
                return error.response.data
            })
    }, [token, id])
    // console.log(movie)
    //função de registrar o filme
    async function updateMovie(movie) {
        let msgType = "success";
        const formData = new FormData();
        // para cada chave jogo dentro do formData pois é ele sera o objeto que sera enviado para api
        await Object.keys(movie).forEach((key) => {
            if (key === "images") {
                for (let i = 0; i < movie[key].length; i++) {
                    formData.append('images', movie[key][i]);
                }
            } else {
                formData.append(key, movie[key]);
            }
        })
        const data = await api.patch(`movies/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                msgType = "error";
                return error.response.data;
            })
        setFlashMessage(data.message, msgType);
        if (msgType !== "error") {
            navigate("/movie/mymovie");
        }
    }

    return (
        <section>
            <div className={styles.addmovie_header}>
                <h1>Editar Filme: {movie.title}</h1>
            </div>
            {movie.title && (
                <MovieForm handleSubmit={updateMovie} movieData={movie} btnText="Atualizar" />
            )}
            
        </section>
    )
}

export default EditMovie