import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//components
import Navbar from './components/layouts/Navbar/Navbar';
import Footer from './components/layouts/Footer/Footer';
import Container from './components/layouts/Container/Container';
import Message from './components/layouts/Message/Message'
// Pages
// User
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home';
import Profile from './components/pages/User/Profile';
/*Context */
import { UserProvider } from './context/UserContext';
/*Movie */
import MyMovie from './components/pages/Movie/MyMovie/MyMovie';
import AddMovie from './components/pages/Movie/AddMovie/AddMovie';
import Movie from './components/pages/Movie/Movie/Movie';
import EditMovie from './components/pages/Movie/EditMovie/EditMovie';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/user/profile' element={<Profile />} />
            <Route path='/movie/mymovie' element={<MyMovie/>}/>
            <Route path='/movie/:id' element={<Movie/>}/>
            <Route path='/movie/add' element={<AddMovie/>}/>
            <Route path='/movie/edit/:id' element={<EditMovie/>}/>
            <Route path='/' element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;

// AULA  270