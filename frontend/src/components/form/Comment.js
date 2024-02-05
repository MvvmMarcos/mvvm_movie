import formStyles from './Form.module.css';
import Input from './Input';
import { useState } from 'react';
import Select from './Select';

const Comment = ({handleSubmit, movieData, btnText}) => {
    //constantes da pagina
    const [com, setCom] = useState("");
    
    function handleChange(e){
        setCom({...com, [e.target.name]:e.target.value})
        console.log(com)
    }
    function submit(e){
        e.preventDefault();
        // handleSubmit(com)
    }
    
  return (
    <form onSubmit={submit} className={formStyles.form_container}>
        <textarea name='review'  placeholder='Comente o que achou do filme' OnChange={handleChange}></textarea>
        <input type="submit" value={btnText}/>
    </form>
  )
}
// value={movie.review} 
export default Comment