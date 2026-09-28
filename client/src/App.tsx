import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from '@/components/Home';
import CarDetails from '@/components/car/CarDetails';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car/:id' element={<CarDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
