import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import apiClient, { setAccessToken } from '../api/axiosInstance'

function Login({ onLoginSuccess }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate()
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const auth_response = await apiClient.post("http://localhost:8000/login", {
        userId: userId,
        password: password,
      });

      console.log(auth_response.data)
      setAccessToken(auth_response.data.access_token);

      onLoginSuccess();

      navigate("/hello");

    } catch {
      setErrorMessage("Incorrect ID or password");
    }
  }

  return (
    <section>
      <div>
        <h1>App name</h1>
      </div>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <p>Enter your ID and password to sign in for this app</p>
        <div>
          <input
            type="text"
            placeholder="Enter your organization ID"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p>{errorMessage}</p>
        <div>
          <input 
            type="submit"
            value="Continue"
          />
        </div>
        <p>By clicking continue, you agree to our Terms of Service and Privacy Policy</p>
      </form>
    </section>
  )
}

export default Login
