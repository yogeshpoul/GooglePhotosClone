import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AuthChecker({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means not yet determined
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/JWTVerifier", {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        if (response.data.message === 'success') {
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          setIsAuthenticated(false);
          navigate("/");
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/");
      }
    }
    fetchData();
  }, [navigate]);

  if (isAuthenticated === null) {
    // Optionally, render a loading spinner or similar here while the authentication check is in progress
    return <div>Loading...</div>;
  }

  return children;
}

export default AuthChecker;
