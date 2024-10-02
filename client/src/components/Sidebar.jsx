import { useState } from "react";
import { filterRestaurants, loadHomepage } from '../services/fetchers';

function Sidebar(props) {
  const [name, setName] = useState('');
  const [vegan, setVegan] = useState(false);
  const [fastfood, setFastFood] = useState(false);
  const [desert, setDesert] = useState(false);
  const [coffee, setCoffee] = useState(false);
  const [asian, setAsian] = useState(false);

  function restNameChange(event) {
    setName(event.target.value)
  }

  function veganChange(event) {
    setVegan(event.target.checked);
  }

  function fastfoodChange(event) {
    setFastFood(event.target.checked);
  }

  function desertChange(event) {
    setDesert(event.target.checked);
  }

  function coffeeChange(event) {
    setCoffee(event.target.checked);
  }

  function asianChange(event) {
    setAsian(event.target.checked);
  }

  async function searchRestaurant(event) {
    event.preventDefault();
    event.stopPropagation();

    if (name || vegan || asian || fastfood || desert || coffee) {
      const formData = new FormData();
      let checks = '';
      if (vegan) {
        checks += 'vegan ';
      }
      if (asian) {
        checks += 'asian ';
      }
      if (fastfood) {
        checks += 'fastfood ';
      }
      if (desert) {
        checks += 'desert ';
      }
      if (coffee) {
        checks += 'coffee';
      }
      formData.append('name', name);
      formData.append('categories', checks);
      try {
        const response = await filterRestaurants(formData);
        const data = await response.json();
        props.onFilter(data.restaurants);
      } catch (error) {
        console.log(error);
      }
    } else {
      const response = await loadHomepage();
      const data = await response.json();
      props.onFilter(data.restaurants);
    }
  }

	return (
		<div className='sidebar'>
			<br/>
			<br/>
			<br/>
			<form onSubmit={searchRestaurant}>
				<label>Search restaurant</label>
				<input className='textInput' name='restName' type='text' onChange={restNameChange}/>
				<br/>
        <div className="checkboxes">
          <input name='isVegan' type='checkbox' value='Vegan' id="isVeganCheck" onChange={veganChange}/>
          <label htmlFor="isVeganCheck">Vegan</label>
          <br/>
          
          <input name='isAsian' type='checkbox' value='Asian' id="isAsianCheck" onChange={asianChange}/>
          <label htmlFor="isAsianCheck">Asian</label>
          <br/>

          <input name='isFastfood' type='checkbox' value='Fastfood' id="isFastfoodCheck" onChange={fastfoodChange}/>
          <label htmlFor="isFastfoodCheck">Fastfood</label>
          <br/>

          <input name='isDesert' type='checkbox' value='Desert' id="isDesertCheck" onChange={desertChange}/>
          <label htmlFor="isDesertCheck">Desert</label>
          <br/>

          <input name='isCoffee' type='checkbox' value='Coffee' id="isCoffeeCheck" onChange={coffeeChange}/>
          <label htmlFor="isCoffeeCheck">Coffee</label>
          <br/>
        </div>
				<input type="submit" value="Search"></input>
			</form>
      </div>
	);
}

export default Sidebar;