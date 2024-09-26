import React, { useState } from 'react';
import { Container, Input, Button, Box, Text, FormControl, FormLabel, InputGroup, InputRightElement } from '@chakra-ui/react';

const BASE_URL = 'http://192.168.0.111:5000'; // Flask server URL

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });
      if (response.ok) {
        setAuthenticated(true);
        localStorage.setItem('auth', 'true');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };
  
  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container centerContent>
      <Box p={4} bg="white" borderRadius="md" boxShadow="md" width="100%" maxWidth="400px">
        <Text fontSize="2xl" mb={4} textAlign="center">Login</Text>
        <FormControl id="username" mb={3}>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" mb={3}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {error && <Text color="red.500" mb={3}>{error}</Text>}
        <Button onClick={handleLogin} colorScheme="blue" width="100%">Login</Button>
      </Box>
    </Container>
  );
};

export default Login;