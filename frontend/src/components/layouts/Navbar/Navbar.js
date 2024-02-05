import { Link } from "react-router-dom";
import Logo from '../../../assets/img/logo.png';
import styles from './Navbar.module.css';
/*Context */
import { useContext } from "react";
import { Context } from "../../../context/UserContext";



const Navbar = () => {
  const {authenticated, logout} = useContext(Context);
  return (
    <nav className={styles.navbar}>
        <div className={styles.navbar_logo}>
            <Link to="/"><img src={Logo} alt="MVVMWEB MOVIE" /></Link>
            <h2>Mvvmweb Movie</h2>
        </div>
        <ul>
          <li><Link to='/'>Filmes</Link></li>
          {authenticated ? (
            <>
            <li><Link to="movie/mymovie">Meus Filmes</Link></li>
            <li><Link to="user/profile">Perfil</Link></li>
            <li onClick={logout}>Sair</li>
            </>
          ) : (
            <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/register'>Registrar</Link></li>
            </>
          )}
  
        </ul>
    </nav>
  )
}

export default Navbar