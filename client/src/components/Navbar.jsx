import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clearCookie } from "../services/fetchers";

function Navbar() {
  const [admin, setAdmin] = useState(false);
  const [personName, setPersonName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setAdmin(decodedToken.admin);
      setPersonName(decodedToken.personName);
    }
  }, [])

  async function handleLogout() {
    await clearCookie();
    localStorage.removeItem('token');
  }

  return (
    <nav>
      <div className="left-nav">
        <Link to='/'>Homepage</Link>
        { admin && <>
          <Link to='/add-restaurant'>Add new restaurant</Link>
          <Link to='/admin-reservations'>Manage reservations</Link>
        </> }
      </div>

      <div className="right-nav">
        { personName && <>
          <span>Signed in as: { personName }</span>
          <Link to='/login' onClick={async () => { await handleLogout(); } }>Logout</Link>
          </> }
        { !personName && <a href="/login">Login</a> }
      </div>
    </nav>
  )
}

export default Navbar;