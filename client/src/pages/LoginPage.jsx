import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { loginUser } from '../services/fetchers';
import { useAuth } from '../hooks/auth';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login';
  }, []);
  
  function usernameChange(event) {
    setUsername(event.target.value);
  }

  function passwordChange(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {   
    event.preventDefault();
    event.stopPropagation();

    if (!username || !password) {
      setError('Please fill all the fields!');
      setToken('');
    } else {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      try {
        const response = await loginUser(formData);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          setToken('');
          navigate('/login', { replace: true });
        } else {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          const decodedToken = jwtDecode(data.token);
          setAuth({ token, userID: decodedToken.userID, personName: decodedToken.personName, admin: decodedToken.admin });
          navigate('/');
        }
      } catch (error) {
        console.log(error);
        setError(error);
      }
    } 
  }

  return (
    <div>
      <h1>Login</h1>
      <div className='container'>
        <form onSubmit={handleSubmit} >
          <label className="form-label">Username</label>
          <br/>
          <input name="username" type="text" required onChange={usernameChange}/>
          <br/>
          <label className="form-label">Password</label>
          <br/>
          <input name="password" type="password" required onChange={passwordChange}/>
          <br/>
          <input type="submit" value="Login" id="rest-form-submit" />
          <br/>
          {error && <span className='error'>{ error }</span>}
          <br/>
          <p>Create new account</p>
          <a href="/register">Register</a>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;