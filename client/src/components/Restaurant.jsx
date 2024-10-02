import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';
import { getRestaurantDetails } from '../services/fetchers';

const backendAddress = 'http://localhost:8080';

function Restaurant(props) {
  const [detailState, setDetailState] = useState(false);
  const navigate = useNavigate();

  async function restaurantClicked() {
    try {
      const response = await getRestaurantDetails(props.restaurant._id);
      const data = await response.json();
      const { restaurant } = data;
      navigate('/details', { state: { restaurant } });
    } catch (error) {
      console.log(error);
      navigate('/details', { state: { error } });
    }
  }

  if (props.error) {
    return (
      <div className='restaurantListItem'>
        <div className='cardDetails'>
          <div className='middleText'>  
            <div>{props.error}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='restaurantListItem' onClick={ async () => { await restaurantClicked(); } } onMouseEnter={() => setDetailState(true)} onMouseLeave={() => setDetailState(false)} >
        {props.image && <img alt={ props.image } src={ `${backendAddress}/uploadDir/${props.image}` }/>}
        <div className='cardDetails'>
          <div className='middleText'>
            <h2>{props.restaurant.name}</h2>
  
            {detailState && <Collapse>
                <>
                  <div>Address: {props.restaurant.city}, {props.restaurant.street} Street, nr {props.restaurant.buildingNr}</div>
                  <div>Contact: {props.restaurant.phoneNr}</div>
                </>
              </Collapse> }
            
            <div>Open: {props.restaurant.openHr} - {props.restaurant.closeHr}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Restaurant;