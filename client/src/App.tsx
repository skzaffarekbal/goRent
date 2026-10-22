import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from '@/components/Home';
import CarDetails from '@/components/car/CarDetails';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/user/Profile';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car/:id' element={<CarDetails />} />

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        <Route
          path='/me/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
