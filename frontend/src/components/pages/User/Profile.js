import formStyles from '../../form/Form.module.css';
import styles from './Profile.module.css';
import api from '../../../utils/api';
import { useState, useEffect } from 'react';
/*Hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';
import Input from '../../form/Input';
/*Components */
import RoundedImage from '../../layouts/RoundedImage/RoundedImage';

const Profile = () => {
    const [user, setUser] = useState({});
    const [token] = useState(localStorage.getItem('token') || '');
    const [preview, setPreview] = useState();
    const {setFlashMessage} = useFlashMessage();
    //usar o useEffect para acessar a api e preencher os dados do usuario com os do banco de dados
    useEffect(()=>{
        api.get("/users/checkuser",{
            headers:{
                Authorization:`Bearer ${JSON.parse(token)}`
            }
        })
        .then((response)=>{
            setUser(response.data)
        })
    },[token])
    //Preencher o objeto user com os dados dos input
    function handleChange(e){
        setUser({...user,[e.target.name]:e.target.value});
        // console.log(user);
    }
    //images
    function onFileChange(e){
        setPreview(e.target.files[0]);
        setUser({...user,[e.target.name]:e.target.files[0]})

    }
    //submeter o formulário;
    async function handleSubmit(e){
        e.preventDefault();
        let msgType = 'success';
        const formData = new FormData();
        await Object.keys(user).forEach((key)=>{
            formData.append(key, user[key])
        })
        const data = await api.patch(`/users/edit/${user._id}`, formData,{
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
    }
  return (
    <section className={formStyles.form_container}>
        <div className={styles.profile_container}>
            <h1>Perfil</h1>
            {(user.image || preview) && (
                <RoundedImage src={preview ? URL.createObjectURL(preview)
                    : `${process.env.REACT_APP_API}/images/users/${user.image}`} 
                alt={user.name}
                 />
            )}
        </div>
        <form onSubmit={handleSubmit}>
            <Input text="image" type="file" name="image" handleOnChange={onFileChange}/>
            <Input text="E-mail" type="email" name="email" placeholder="Digite o seu e-mail" handleOnChange={handleChange} value={user.email || ""}/>
            <Input text="Nome" type="name" name="name" placeholder="Digite o seu nome" handleOnChange={handleChange} value={user.name || ""}/>
            <Input text="Senha" type="password" name="password" placeholder="Digite o seu nome" handleOnChange={handleChange}/>
            <Input text="Confirme a senha" type="password" name="confirmpassword" placeholder="Confirmação de senha" handleOnChange={handleChange}/>
            <input type="submit" value="Atualizar" />
        </form>
    </section>
  )
}

export default Profile