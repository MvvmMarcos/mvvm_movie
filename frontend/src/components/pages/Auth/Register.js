import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import style from '../../form/Form.module.css'
import Input from '../../form/Input'
import { Context } from '../../../context/UserContext';

const Register = () => {
  //iniciar os estados dos inputs vazio
  const [user, setUser] = useState({});
  //extrair o context o método registrar
  const {register} = useContext(Context)
  //Atualiza o objeto user com os dados dos inputs
  function handleChange(e) {
   setUser({...user,[e.target.name]:e.target.value});
  }
  //envia o objeto para o banco de dados
  function handleSubmit(e){
    e.preventDefault();
    // console.log(user);
    //envia os dados para o banco de dados
    register(user);
  }
  return (
    <section className={style.form_container}>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        <Input text="Nome" type="text" name="name" placeholder="Digite o seu nome completo"
          handleOnChange={handleChange} />
        <Input text="E-mail" type="email" name="email" placeholder="Digite o seu e-mail" handleOnChange={handleChange} />
        <Input text="Senha" type="password" name="password" placeholder="Digite a sua senha" handleOnChange={handleChange} />
        <Input text="Confirmação de senha" type="password" name="confirmpassword" placeholder="Confirme a sua senha" handleOnChange={handleChange} />
        <input type="Submit" value="Cadastrar" />
      </form>
      <p>Já tem uma conta? <Link to="/login">Clique aqui!</Link></p>
    </section>
  )
}

export default Register