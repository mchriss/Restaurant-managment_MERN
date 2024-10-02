import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/auth';
import Navbar from '../components/Navbar';
import { addRestaurant } from '../services/fetchers';
import jwtDecode from 'jwt-decode';

function NewRestaurantPage() {
  const [restName, setRestName] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [buildingNr, setBuildingNr] = useState('');
  const [phoneNr, setPhoneNr] = useState('');
  const [openHr, setOpenHr] = useState('');
  const [closeHr, setClosehr] = useState('');
  const [categories, setCategories] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Add new Restaurant';
  }, []);

  function nameChange(event) {
    setRestName(event.target.value);
  }

  function cityChange(event) {
    setCity(event.target.value);
  }

  function streetChange(event) {
    setStreet(event.target.value);
  }

  function buildingChange(event) {
    setBuildingNr(event.target.value);
  }

  function phoneChange(event) {
    setPhoneNr(event.target.value);
  }

  function openChange(event) {
    setOpenHr(event.target.value);
  }

  function closeChange(event) {
    setClosehr(event.target.value);
  }

  function categoriesChange(event) {
    setCategories(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    if (!decodedToken.admin) {
      setMessage('Permission denied');
    }

    if (!restName || !city || !street || !buildingNr || !phoneNr || !openHr || !closeHr) {
      setMessage('Please fill all the fields');
    } else {
      const formData = new FormData();
      formData.append('restName', restName);
      formData.append('city', city);
      formData.append('street', street);
      formData.append('buildingNr', buildingNr);
      formData.append('phoneNr', phoneNr);
      formData.append('openHr', openHr);
      formData.append('closeHr', closeHr);
      formData.append('categories', categories);
      setMessage('Validating...');
      try {
        const response = await addRestaurant(formData);
        const data = await response.json();
        if (!data.error) {
          navigate('/', { replace: true });
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        console.log(error);
        setMessage(error);
      }
    }
  }

  return (
    <div>
      <AuthContext.Consumer>
        { value => <Navbar personName={value.auth.personName} admin={value.auth.admin} /> }
      </AuthContext.Consumer>
      <br/>
      <br/>
      <h1>Add a new restaurant to your database</h1>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <label className="form-label">Name of restaurant</label>
          <br/>
          <input name="restName" type="text" pattern="^[A-Z][A-Za-z0-9 '-]+$" required onChange={nameChange}/>
          <br/>

          <label className="form-label">City</label>
          <br/>
          <input name="city" type="text" pattern="^[A-Z][A-Za-z ]+$" required onChange={cityChange}/>
          <br/>

          <label className="form-label">Street</label>
          <br/>
          <input name="street" type="text" pattern="^[A-Z][A-Z a-z0-9'-]+$" required onChange={streetChange}/>
          <br/>

          <label className="form-label">Building number</label>
          <br/>
          <input name="buildingNr" type="number" required onChange={buildingChange}/>
          <br/>

          <label className="form-label">Phone number</label>
          <br/>
          <input name="phoneNr" type="text" pattern="^\+?[0-9]+$" required onChange={phoneChange}/>
          <br/>

          <label className="form-label">Open hours</label>
          <br/>
          <div id="time-interval">
              <input name="openHr" type="time" min="07:00" max="17:00" required onChange={openChange}/>
              <span>-</span>
              <input name="closeHr" type="time" min="12:00" max="04:00" required onChange={closeChange}/>
          </div>
          <br/>

          <label className="form-label">Categories (hashtags)</label>
          <br/>
          <input name="categories" type="text" pattern="[\w\s]+" required onChange={categoriesChange}/>
          <br/>

          <input type="submit" value="Save" id="rest-form-submit" />
          <br/>
          {message && <span>{ message }</span>}
        </form>
      </div>
    </div>
  );
}

export default NewRestaurantPage;