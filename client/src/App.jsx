import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DetailsPage from './pages/DetailsPage';
import NewRestaurantPage from './pages/NewRestaurantPage';
import ManageReservationsPage from './pages/ManageReservationsPage';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Homepage/>} />
      <Route exact path='/login' element={<LoginPage/>} />
      <Route exact path='/register' element={<RegistrationPage/>} />
      <Route exact path='/details' element={<DetailsPage/>} />
      <Route exact path='/add-restaurant' element={<NewRestaurantPage/>} />
      <Route exact path='/admin-reservations' element={<ManageReservationsPage/>} />
    </Routes>
  );
}

export default App;
