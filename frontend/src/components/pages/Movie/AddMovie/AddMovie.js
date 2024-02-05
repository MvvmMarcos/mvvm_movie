import styles from './AddMovie.module.css';
import api from '../../../../utils/api';
import {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
/*Hooks */
import useFlashMessage from '../../../../hooks/useFlashMessage';
/*Components */
import MovieForm from '../../../form/MovieForm';



const AddMovie = () => {
  const {id} = useParams()
  const [token] = useState(localStorage.getItem('token') || '');
  const {setFlashMessage} = useFlashMessage();
  //navigate
  const navigate = useNavigate();
  
  //função de registrar o filme
  async function RegisterMovie(movie){
    let msgType = "success";
    const formData = new FormData();
    // para cada chave jogo dentro do formData pois é ele sera o objeto que sera enviado para api
    await Object.keys(movie).forEach((key)=>{
      if(key === "images"){
        for(let i = 0; i < movie[key].length;i++){
          formData.append('images', movie[key][i]);
        }
      }else{
        formData.append(key, movie[key]);
      }
    })
    const data = await api.post('movies/create', formData,{
      headers:{
        Authorization: `Bearer ${JSON.parse(token)}`,
        "Content-Type":"multipart/form-data"
      }
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
      navigate("/movie/mymovie");
    }
  }

  return (
    <section>
      <div className={styles.addmovie_header}>
        <h1>Cadastrar Filmes</h1>
      </div>
      <MovieForm handleSubmit={RegisterMovie} btnText="Cadastrar"/>
    </section>
  )
}

export default AddMovie