import { useState, useEffect } from 'react';
import { loadHomepage } from '../services/fetchers';
import Restaurant from '../components/Restaurant';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function Homepage() {
  const [restaurants, setRestaurants] = useState([]);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Homepage';
    async function fetchData() {
      try {
        const response = await loadHomepage();
        const data = await response.json();
        const {restaurants, images, message, error} = data;
        setRestaurants(restaurants);
        setImages(images);
        setMessage(message);
        setError(error);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div id='homepage'>
      <Navbar/>
      <Sidebar onFilter={setRestaurants}/>
      <div className='mainContent'>
        <br/>
        <br/>
        <h1>Our Restaurants</h1>
        <div className='content'>
          { restaurants.length > 0 && <div className='listContainer'>
            {restaurants.map((restaurant) => <Restaurant key={restaurant._id} restaurant={restaurant} image={images[restaurant._id]} message={message} error={error} onDelete={setRestaurants} />)}
          </div> }
          { restaurants.length === 0 && <Restaurant error={'No restaurant found :('} />}
        </div>
      
      </div>
    </div>
  )
}

export default Homepage;