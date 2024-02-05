import formStyles from './Form.module.css';
import Input from './Input';
import { useState } from 'react';
import Select from './Select';

const MovieForm = ({handleSubmit, movieData, btnText}) => {
    //constantes da pagina
    const [movie, setMovie] = useState(movieData || {});
    const [preview, setPreview] = useState([]);
    const categoryArray = ["Ação","Cinema de arte","Chanchada","Comédia","Comédia de ação","Comédia de terror","Comédia dramática","Comédia","Desenho", "romântica","Dança","Documentário","Docuficção","Drama","Espionagem","Faroeste","Fantasia","Fantasia científica","Ficção científica","Filmes com truques","Filmes de guerra","Mistério","Musical","Filme policial","Romance","Terror","Thriller"]
    //função que cria o preview e tranforma o filelist em array
    function onFileChange(e){
        setPreview(Array.from(e.target.files))
        setMovie({...movie,[e.target.name]:e.target.files})
    }
    function handleChange(e){
        setMovie({...movie, [e.target.name]:e.target.value})
    }
    function handleCategory(e){
        setMovie({...movie,category:e.target.options[e.target.selectedIndex].text})
    }
    function submit(e){
        e.preventDefault();
        handleSubmit(movie)
    }
  return (
    <form onSubmit={submit} className={formStyles.form_container}>
        <div className={formStyles.preview_movie}>
            {preview.length > 0 
            ? preview.map((image, index)=>(
                <img src={URL.createObjectURL(image)}
                alt={movie.name} 
                key={`${movie.name} + ${index}`}/>
            ))
            :
            movie.images && movie.images.map((image, index)=>(
                <img src={`${process.env.REACT_APP_API}/images/movies/${image}`}
                alt={movie.name} 
                key={`${movie.name} + ${index}`}/>
            ))
            }

        </div>
        <Input text="Imagens do filme" type="file" name="images" handleOnChange={onFileChange} multiple={true} />
        <Input text="Título do filme" type="text" name="title" handleOnChange={handleChange} placeholder="Digite o título do filme" value={movie.title || ""}/>
        <Input text="Descrição do filme" type="text" name="description" handleOnChange={handleChange} placeholder="Digite a descrição do filme"
        value={movie.description || ""}/>
        <Input text="Trailer" type="text" name="trailer" handleOnChange={handleChange} placeholder="Digite a URL do trailer" value={movie.trailer || ""}/>
        <Select text="Selecione a categoria" name="category" options={categoryArray} handleOnChange={handleCategory} value={movie.category || ""}/>
        <Input text="Duração do filme" type="text" name="length" handleOnChange={handleChange} placeholder="Digite duração do filme ex: 1h 30m" value={movie.length || ""}/>
        <input type="submit" value={btnText}/>
    </form>
  )
}

export default MovieForm