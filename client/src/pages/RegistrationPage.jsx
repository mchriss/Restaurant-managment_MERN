import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { registerUser } from '../services/fetchers';
import { useAuth } from '../hooks/auth';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [personName, setPersonName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Register';
  }, []);

  function usernameChange(event) {
    setUsername(event.target.value);
  }

  function personNameChange(event) {
    setPersonName(event.target.value);
  }

  function passwordChange(event) {
    setPassword(event.target.value);
  }

  function repeatedPasswordChange(event) {
    setRepeatedPassword(event.target.value);
  }


  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!username || !personName || !password || !repeatedPassword) {
      setError('Please fill all the fields!');
      setToken('');
    } else {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('personName', personName);
      formData.append('password', password);
      formData.append('passwordAgain', repeatedPassword);

      try {
        const response = await registerUser(formData);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          setToken('');
          navigate('/register', { replace: true });
        } else {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          const decodedToken = jwtDecode(data.token);
          setAuth({ token, userID: decodedToken.userID, personName: decodedToken.personName, role: decodedToken.admin });
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
      <h1>Register</h1>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <label className="form-label">Username</label>
          <br/>
          <input name="username" type="text" required onChange={usernameChange}/>
          <br/>
          <label className="form-label">Full name</label>
          <br/>
          <input name="personName" type="text" pattern="^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+" required onChange={personNameChange}/>
          <br/>
          <label className="form-label">Password</label>
          <br/>
          <input name="password" type="password" required onChange={passwordChange}/>
          <br/>
          <label className="form-label">Repeat password</label>
          <br/>
          <input name="passwordAgain" type="password" required onChange={repeatedPasswordChange}/>
          <br/>
          <input type="submit" value="Register" id="rest-form-submit" />
          <br/>
          {error && <span className='error'>{ error }</span>}
          <br/>
          <p>Existing user?</p>
          <a href="/login">Sign in</a>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;