import { useState } from "react";
import { filterReservationsByStatus } from '../services/fetchers';

function AdminSidebar(props) {
  const [status, setStatus] = useState('PENDING');

  function changeStatus(event) {
    setStatus(event.target.value);
  }
 
  async function filterReservations(event) {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData();
    formData.append('status', status);
    try {
      const response = await filterReservationsByStatus(formData);
      const data = await response.json();
      props.onFilter(data.restaurants);
    } catch (error) {
      console.log(error);
    }
  }

	return (
		<div className='sidebar'>
			<br/>
			<br/>
			<br/>
      <div>Filter by status</div>
			<form onSubmit={filterReservations}>
        <select id="statusList" onChange={changeStatus}>
          <option value='PENDING'>Pending</option>
          <option value='APPROVED'>Approved</option>
          <option value='DECLINED'>Declined</option>
        </select>
        <input value='Filter' type='submit'/>
			</form>
      </div>
	);
}

export default AdminSidebar;