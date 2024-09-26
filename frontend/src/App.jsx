import React, { useState, useEffect } from 'react';
import { Container, Flex } from '@chakra-ui/react';
import NavBar from './components/Navbar';
import ClientGrid from './components/ClientGrid.jsx';
import Login from './components/Login';

export const BASE_URL = 'http://192.168.0.111:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('auth') === 'true');

  useEffect(() => {
    const setAuth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/verify_auth`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        if (data.success == 'True') {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    setAuth();
  }, [setAuthenticated]);

  if (!authenticated) {
    return <Login setAuthenticated={setAuthenticated} />;
  }

  return (
    <Container minW="100%" minH="100vh" bg="#1A202C" p={0} m={0}>
      <Flex h="4" bg="#1A202C" />
      <NavBar setUsers={setUsers} setAuthenticated={setAuthenticated} />
      <ClientGrid users={users} setUsers={setUsers} />
    </Container>
  );
}

export default App;