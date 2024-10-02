import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import { getAllReservations, getAllRestaurants, updateReservation } from '../services/fetchers';

function ManageReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    document.title = 'Manage';
    const restaurantList = {};
    async function fetchData() {
      try {
        const response = await getAllReservations();
        const restaurants = await getAllRestaurants();
        const restaurantData = await restaurants.json();
        const data = await response.json();
        if (!data.error) {
          setReservations(data.reservations);
        } else {
          console.log(data.error);
        }
        restaurantData.restaurants.map((restaurant) => restaurantList[restaurant._id.toString()] = restaurant)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    setRestaurants(restaurantList);
  }, []);

  async function manageReservation(id, approved) {
    try {
      await updateReservation(id.toString(), approved);
      const response = await getAllReservations();
      const data = await response.json();
        if (!data.error) {
          setReservations(data.reservations);
        } else {
          console.log(data.error);
        }
    } catch (error) {
      console.log(error);
    }
  }

  function reservationCard(reservation) {
    return (
      <div className="container">
        <div>User: {reservation.username}</div>
        <div>Restaurant: {restaurants[reservation?.restaurantID]?.name}</div>
        <div>Table: {reservation.tableNr}</div>
        <div>Date: {reservation.date}</div>
        <div>Status: {reservation.status}</div>
        <div className="approveReservation">
          <button className="approveButton" onClick={async () => await manageReservation(reservation._id, true)}>Approve</button>
          <button className="rejectButton" onClick={async () => await manageReservation(reservation._id, false)}>Reject</button>
        </div>
      </div>
    );
  }

  if (!decodedToken.admin || !token) {
    return (
      <div>
      <Navbar/>
      <br/>
      <div className="container">
        <span>Permission denied</span>
      </div>
    </div>
    );
  } else {
    return (
      <div>
        <Navbar/>
        <AdminSidebar onFilter={setReservations}/>
        <br/>
        <br/>
        <h1>Manage reservations</h1>
        {reservations.map((reservation) => {return reservation && reservationCard(reservation)})}
      </div>
    );
  }
}

export default ManageReservationsPage;