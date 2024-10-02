const backendAddress = 'http://localhost:8080'

export async function loadHomepage() {
  return await fetch(`${backendAddress}/`, {
    method: 'GET',
  });
}

export async function getAllRestaurants() {
  return await fetch(`${backendAddress}/all-restaurants`, {
    method: 'GET',
  });
}

export async function getAllReservations() {
  return await fetch(`${backendAddress}/all-reservations`, {
    method: 'GET',
  });
}

export async function getRestaurantDetails(restaurantID) {
  return await fetch(`${backendAddress}/restaurant_details/${restaurantID}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer: ${localStorage.getItem('token')}`
    }
  });
}

export async function filterRestaurants(data) {
  return await fetch(`${backendAddress}/filter-restaurants`, {
    method: 'POST',
    body: data,
    headers: {
      'Authorization': `Bearer: ${localStorage.getItem('token')}`
    }
  });
}

export async function filterReservationsByStatus(data) {
  return await fetch(`${backendAddress}/filter-reservations`, {
    method: 'POST',
    body: data,
    headers: {
      'Authorization': `Bearer: ${localStorage.getItem('token')}`
    }
  });
}

export async function clearCookie() {
  return await fetch(`${backendAddress}/logout`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function loginUser(data) {
  return await fetch(`${backendAddress}/login`, {
    method: 'POST',
    enctype: "multipart/form-data",
    credentials: 'include',
    body: data,
  });
}

export async function registerUser(data) {
  return await fetch(`${backendAddress}/register`, {
    method: 'POST',
    enctype: "multipart/form-data",
    credentials: 'include',
    body: data,
  });
}

export async function addRestaurant(data) {
  return await fetch(`${backendAddress}/add-restaurant`, {
    method: 'POST',
    enctype: "multipart/form-data",
    credentials: 'include',
    body: data,
  });
}

export async function addReservation(data) {
  return await fetch(`${backendAddress}/add-reservation`, {
    method: 'POST',
    enctype: "multipart/form-data",
    credentials: 'include',
    body: data,
  });
}

export async function addImages(id, data) {
  return await fetch(`${backendAddress}/add-images/${id}`, {
    method: 'POST',
    enctype: "multipart/form-data",
    credentials: 'include',
    body: data,
  });
}

export async function deleteRestaurant(id) {
  return await fetch(`${backendAddress}/delete-restaurant/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function deleteReservation(id) {
  return await fetch(`${backendAddress}/delete-reservation/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function deleteImage(id) {
  return await fetch(`${backendAddress}/delete-image/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export async function updateReservation(id, approved) {
  if (approved) {
    return await fetch(`${backendAddress}/approve-reservation/${id}/approve`, {
      method: 'POST',
      credentials: 'include',
    });
  } else {
    return await fetch(`${backendAddress}/approve-reservation/${id}/reject`, {
      method: 'POST',
      credentials: 'include',
    });
  }
}