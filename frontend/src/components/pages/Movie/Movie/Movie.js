import styles from './Movie.module.css';
import api from '../../../../utils/api';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
/*Hooks*/
import useFlashMessage from '../../../../hooks/useFlashMessage';
import RoundedImage from '../../../layouts/RoundedImage/RoundedImage';


const Movie = () => {
    const [movie, setMovie] = useState({});
    const { id } = useParams();
    const { setFlashMessage } = useFlashMessage();
    const [token] = useState(localStorage.getItem('token') || "");
    const navigate = useNavigate();
    const [review, setReview] = useState("")
    const [rating, setRating] = useState([]);

    useEffect(() => {
        api.get(`/movies/${id}`)
            .then((response) => {
                return setMovie(response.data.movie);
            })
            .catch((error) => {
                return error.response.data
            })
    }, [id]);
     
    function handleChange(e){
        setReview(e.target.value);
    }
    function handleRating(e){
        setRating(e.target.options[e.target.selectedIndex].text)
    }
    async function registerComment(e){
        let msgType = "success";
        const data = await api.patch(`/movies/comments/${id}`, {rating, review}, {
            headers:{
                Authorization: `Bearer ${JSON.parse(token)}`,
                "Content-Type":"application/json"
              },
        })
        .then((response)=>{
            return response.data;
          })
          .catch((error)=>{
            msgType = "error";
            return error.response.data;
          })
          setFlashMessage(data.message, msgType);
          if(msgType !== "error"){
            navigate(`/movie/${id}`);
          }
    }
    
    return (
        <>
            <section>
                <div className={styles.movie_header}>
                    <h1>{movie.title}</h1>
                    <p><span className="bold">Duração: </span>{movie.length} <span className={styles.pipe}></span> <span className="bold">Categoria: </span>{movie.category}<span className={styles.pipe}></span> <i class="fa-solid fa-star"></i> {movie.average}</p>
                    <p className={styles.description}>{movie.description}</p>

                </div>
                <div className={styles.movie_container}>
                <div className={styles.movie_Trailer}>
                    <iframe width="560" height="315" src={`${movie.trailer}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                <div className={styles.movie_photo}>
                    {movie.images && movie.images.map((image, index) => (
                        <img
                            src={`${process.env.REACT_APP_API}/images/movies/${image}`}
                            alt={movie.title}
                            key={index}
                        />
                    ))}
                </div>
                </div>
                

                {movie.comments && (
                    <div className={styles.movie_comments_container}>
                        {movie.comments.map((comment, index) => (
                            <div className={styles.movie_comments}>
                                {comment.image ? (<RoundedImage
                                src={`${process.env.REACT_APP_API}/images/users/${comment.image}`}
                                alt={comment.name}
                                key={index}
                                width="w75"
                            />) : (<RoundedImage
                                src={`${process.env.REACT_APP_API}/images/users/user.png`}
                                alt={comment.name}
                                key={index}
                                width="w75"
                            />)}
                                <p key={index} className={styles.rating}><i class="fa-solid fa-star"></i>{comment.rating}</p>
                                <p key={index}>{comment.name}</p>
                                <p><span className={styles.pipe}></span></p>
                                <p key={index}>{comment.review}</p>
                            </div>
                        ))}
                    </div>
                )}

                {token ? (
                    <div className={styles.create_comments}>
                    <form onSubmit={registerComment}>
                    <label htmlFor="rating">Nota:</label>
                    <select name="rating" onChange={handleRating}>
                        <option value="">Selecione uma nota:</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <label htmlFor="review">Faça um comentário sobre o filme:</label>
                    <textarea name="review" onChange={handleChange}></textarea>
                        <input type="submit" value="comentar" />
                    </form>
                </div>
                ):(
                    <div className={styles.notice}>
                        <p>Para comentar o filme é necessário ter uma conta, clique nas opções abaixo para se cadastrar ou faça o login caso ja tenha uma conta!</p>
                        <p><Link to="/register">Clique aqui </Link>para fazer o registro!</p>
                        <p><Link to="/login">Clique aqui </Link>para fazer o login!</p>
                    </div>
                    
                )}


            </section>
        </>
    )
}

export default Movie