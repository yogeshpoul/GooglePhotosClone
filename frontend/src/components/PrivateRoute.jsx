import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/JWTVerifier`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        console.log("hereonly1")

        if (response.data.message === 'Success') {
          console.log("hereonly2")
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optional: loading spinner or similar
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

export default PrivateRoute;
