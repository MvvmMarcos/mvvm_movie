import { useContext, useState } from 'react';
import style from '../../form/Form.module.css';
import Input from '../../form/Input';
import { Link } from 'react-router-dom';
import { Context } from '../../../context/UserContext';

const Login = () => {
  //iniciar o objeto user vazio
  const [user, setUser] = useState({});
  //extrair  função login do context
  const {login} = useContext(Context);
  //construir o objeto user com as informações dos inputs
  function handleChange(e){
    setUser({...user,[e.target.name]: e.target.value});
  }

  function handleSubmit(e){
    e.preventDefault();
    login(user)
  }
  return (
    <section className={style.form_container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input text="E-mail" type="email" name="email" placeholder="Digite o seu email" handleOnChange={handleChange}/>
        <Input text="Senha" type="password" name="password" placeholder="Digite a sua senha" handleOnChange={handleChange}/>
        <input type="submit" value="Entrar"/>
      </form>
      <p>Não tem uma conta? <Link to="/register">Clique aqui</Link> e faça o cadastro!</p>
    </section>
  )
}

export default Login