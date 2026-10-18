import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from '@/components/Home';
import CarDetails from '@/components/car/CarDetails';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car/:id' element={<CarDetails />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
