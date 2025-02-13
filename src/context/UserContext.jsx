/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { fetchWhoAmI, logoutUser } from '../api/userAPI';

import axios from 'axios';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);         
  const [loading, setLoading] = useState(true);
  const [selectedTenantId, setSelectedTenantId] = useState(() => {
    return localStorage.getItem('selectedTenantId') || null;
  });

  useEffect(() => {
    async function checkLogin() {
      try {
        const resp = await fetchWhoAmI(selectedTenantId);
        const userData = resp.data;
        const { associatedTenants, associatedTenantIds } = userData || {};

        if (associatedTenants && associatedTenantIds && associatedTenants.length === associatedTenantIds.length) {
          const pairs = associatedTenantIds.map((tid, idx) => ({
            id: tid,
            name: associatedTenants[idx],
          }));
          userData.associatedTenantPairs = pairs;
        } else {
          userData.associatedTenantPairs = [];
        }
        console.log(userData)
        setUser(userData);
        if (userData.selectedTenantId) {
          setSelectedTenantId(userData.selectedTenantId);
        }
        else{
          setSelectedTenantId(userData.defaultTenantId);
        }
        localStorage.setItem('selectedTenantId', selectedTenantId);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, [selectedTenantId]);

  const login = () => {
    window.location.href = 'http://localhost:8083/oauth2/authorization/google';
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setSelectedTenantId(null);
      localStorage.removeItem('selectedTenantId');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      logout,
      selectedTenantId,
      setSelectedTenantId,
    }}>
      {children}
    </UserContext.Provider>
  );
}
