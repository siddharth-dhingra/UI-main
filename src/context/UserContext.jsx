/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);         // { email, role } or null
  const [loading, setLoading] = useState(true);   // show spinner while checking

  // Call the whoami endpoint to see if user is logged in
  useEffect(() => {
    async function checkLogin() {
      try {
        // include credentials so the JSESSIONID cookie is sent
        const resp = await axios.get('http://localhost:8083/whoami', {
          withCredentials: true,
        });
        setUser(resp.data); // e.g. { email: 'user@example.com', role: 'ADMIN' }
        console.log(resp.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  // Initiate Google login
  const login = () => {
    // redirect the browser to the Spring Boot Google OAuth entry point
    window.location.href = 'http://localhost:8083/oauth2/authorization/google';
  };

  // If you have a /logout endpoint, you could do:
  const logout = async () => {
    try {
      await axios.post('http://localhost:8083/logout', null, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
