import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import jwtDecode from 'jwt-decode';
import RestMap from '../components/RestMap';
import { addReservation, getRestaurantDetails, deleteReservation, addImages, deleteImage, deleteRestaurant } from '../services/fetchers';
import Gallery from '../components/Gallery';

function DetailsPage() {
  const { state } = useLocation();
  const { restaurant } = state;

  const [restaurantData, setRestaurantData] = useState({
    restaurant,
    images: [],
    reservations: [],
    tables: [],
    error: null,
  });

  const [reservationForm, setReservationForm] = useState(false);
  const [imageDeleteForm, setImageDeleteForm] = useState(false);
  const [imageDeleteIndex, setImageDeleteIndex] = useState();
  const [imageDeleteError, setImageDeleteError] = useState('');
  const [imageForm, setImageForm] = useState();
  const [tableObject, setTableObject] = useState({
    tableNr: null,
    tableError: '',
  });
  const [date, setDate] = useState();
  const [resFormMsg, setResFormMsg] = useState('');
  const [imgFormMsg, setImgFormMsg] = useState('');
  const [newImages, setNewImages] = useState();
  const [decodedToken, setDecodedToken] = useState('');
  const [myReservations, setMyReservations] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${restaurant.name} | Details`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await getRestaurantDetails(restaurant._id);
      const data = await response.json();
      setRestaurantData(data);
    }
    fetchData();
  }, [restaurant._id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const newToken = jwtDecode(token);
      setDecodedToken(newToken);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const resList = restaurantData.reservations.filter((reservation) => reservation.userID === newToken.userID);
      setMyReservations(resList);
    }
  }, [restaurantData.reservations]);

  function enableImageDeleteForm() {
    setImageDeleteForm(!imageDeleteForm);
  }

  function enableImageForm() {
    setImageForm(!imageForm);
  }

  function enableReservationForm() {
    setReservationForm(!reservationForm);
  }

  function dateChange(event) {
    setDate(event.target.value);
  }

  function imagesDeleteChange(event) {
    setImageDeleteIndex(event.target.value);
  }

  function imagesChange(event) {
    setNewImages(event.target.files);
  }

  function tableClicked(available, number) {
    if (!date) {
      setTableObject({
        tableNr: null,
        tableError: 'Select the reservation date first',
      });
    } else if (available) {
      setTableObject({
        tableNr: number,
        tableError: '',
      });
    } else {
      setTableObject({
        tableNr: null,
        tableError: 'This table is not available',
      });
    }
  }

  async function handleSubmitReservation(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!date || !tableObject.tableNr) {
      setResFormMsg('Select table and date of reservation!');
    } else {
      const formData = new FormData();
      formData.append('restId', restaurant._id);
      formData.append('resrvDate', date);
      formData.append('tableNr', tableObject.tableNr);
      try {
        const response = await addReservation(formData);
        const data = await response.json();
        if (data.error) {
          setResFormMsg(data.error);
        } else {
          const response = await getRestaurantDetails(restaurant._id);
          const resData = await response.json();
          setRestaurantData(resData);
          enableReservationForm();
        }
      } catch (error) {
        console.log(error);
        setResFormMsg(error);
      }
    }
  }

  async function handleDeleteReservation(id) {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      const response = await deleteReservation(id);
      const data = await response.json();
      if (!data.error) {
        const response = await getRestaurantDetails(restaurant._id);
        const resData = await response.json();
        setRestaurantData(resData);
      }
    }
  }

  async function handleDeleteRestaurant(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${restaurantData.restaurant.name}?`)) {
      const response = await deleteRestaurant(restaurant._id);
      const data = await response.json();
      if (!data.error) {
        navigate('/');
      }
    };
  }
  
  async function handleSubmitImage(event) {
    event.preventDefault();
    event.stopPropagation();

    if (newImages.length === 0) {
      setImgFormMsg('No images were selected');
    } else {
      const formData = new FormData();
      for (let i = 0; i < newImages.length; i += 1) {
        formData.append('images', newImages[i]);
      }
      
      try {
        const response = await addImages(restaurant._id, formData);
        const data = await response.json();
        if (data.error) {
          setImgFormMsg(data.error);
        } else {
          const response = await getRestaurantDetails(restaurant._id);
          const resData = await response.json();
          setRestaurantData(resData);
          setImageForm(false);
        }
        
      } catch (error) {
        console.log(error);
        setImgFormMsg(error);
      }
    }
  }
  
  async function handleDeleteImage(event) {
    event.preventDefault();
    event.stopPropagation();

    const image = restaurantData.images[imageDeleteIndex - 1];
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await deleteImage(image._id);
        const data = await response.json();
        if (data.error) {
          setImageDeleteError(data.error);
        } else {
          const response = await getRestaurantDetails(restaurant._id);
          const resData = await response.json();
          setRestaurantData(resData);
          setImageDeleteForm(false);
        }
      } catch (error) {
        console.log(error);
        setImageDeleteError(error);
      }
    }
  }
  
  function reservationList() {
    return (
      <>
        <div>My reservations</div>
        {myReservations.map((reservation) => {
          return (
            <div className="restData">
              <div>
                <div>User: {decodedToken.personName}</div>
                <div>Date: {new Date(reservation.date).toDateString()} {new Date(reservation.date).toLocaleTimeString('en-GB')}</div>
                <div>Table: {reservation.tableNr}</div>
                <div>Status: {reservation.status}</div>
              </div>
              <button onClick={async () => { await handleDeleteReservation(reservation._id); } }>Delete</button>
            </div>
          );
        })}
      </>
    );
  }

  function displayReservationForm() {
    return (
      <form onSubmit={handleSubmitReservation}>
        <label className="form-label">Time of reservation</label>
        <br/>
        <input name="resrvDate" type="datetime-local" min="07:00" max="00:00" required onChange={dateChange}/>
        <br/>
        {date && <>
          <label className="form-label">Select one of the available tables</label>
          <RestMap tables={restaurantData.tables} date={date} reservations={restaurantData.reservations} height={544} width={1000} tableAction={tableClicked}/>
        </>}
        {tableObject.tableError && <div className='error'>{tableObject.tableError}</div>}
        {tableObject.tableNr && <div>Selected table: {tableObject.tableNr}</div>}

        <button type="button" onClick={enableReservationForm}>Cancel</button>
        <input type="submit" value="Place reservation" id="resrv-form-submit"/>
        <br/>
        {resFormMsg && <span>{ resFormMsg }</span>}
      </form>
    )
  }
  
  function displayImageForm() {
    return (
      <form onSubmit={handleSubmitImage}>
        <label className="form-label">Upload images</label>
        <br/>
        <input name="images" type="file" accept="image/*" multiple required onChange={imagesChange}/>
        <br/>
        <button type="button" onClick={enableImageForm}>Cancel</button>
        <input type="submit" value="Upload" id="img-form-submit"/>
        <br/>
        {imgFormMsg && <span className='error' >{ imgFormMsg }</span>}
      </form>
    )
  }
  
    function displayImageDeleteForm() {
      return (
        <form onSubmit={handleDeleteImage}>
          <label className="form-label">Image to be removed</label>
          <input name="imageIndex" type="number" required min='1' max={restaurantData.images.length} onChange={imagesDeleteChange}/>
          <br/>
          <button type="button" onClick={enableImageDeleteForm}>Cancel</button>
          <input type="submit" value="Delete" id="img-delete-form-submit"/>
          <br/>
          {imageDeleteError && <span className='error'>{ imageDeleteError }</span>}
        </form>
      )
    }
  
  return (
    <div>
      <Navbar/>
      <br/>
      <br/>
      <h1>{ restaurantData.restaurant.name }</h1>
      <div className='container'>
        {restaurantData.error ? <span className='error'>{ restaurant.error }</span> : !restaurant.error && <>
          <div>Address: { restaurantData.restaurant.city }, { restaurantData.restaurant.street } Street, { restaurantData.restaurant.buildingNr }</div>
          <div>Contact: { restaurantData.restaurant.phoneNr }</div>
          <div>Open: { restaurantData.restaurant.openHr } - { restaurantData.restaurant.closeHr }</div>
          <span>Categories: </span>
          {restaurantData.restaurant.categories.split(' ').map((tag) => <span>#{tag.toLowerCase()} </span> )}

          <Gallery images={restaurantData.images}/>
          {decodedToken.admin && !imageForm && !imageDeleteForm && <>
            {restaurantData.images.length > 0 && <button onClick={enableImageDeleteForm}>Delete image</button>}
            <button onClick={enableImageForm}>Add images</button>
            <button onClick={handleDeleteRestaurant}>Delete Restaurant</button>
          </> }
          {imageForm && displayImageForm()}
          {imageDeleteForm && displayImageDeleteForm()}
        </> }
      </div>
      {decodedToken && <div className='container'>
        {myReservations.length > 0 ? reservationList() : !reservationForm && <div>No reservation found</div>}
        {!reservationForm ? <button onClick={enableReservationForm}>Place a reservation</button> : displayReservationForm() }
      </div>}
    </div>
  );
}

export default DetailsPage;