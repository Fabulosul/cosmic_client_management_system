// ClientGrid.jsx
import { Grid, Flex, Box, Select, Spinner, Center, Text, Container } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import ClientCard from './ClientCard';
import { BASE_URL } from '../App';
import { css } from '@emotion/react';

const ClientGrid = ({ users, setUsers }) => {
  const [sortedUsers, setSortedUsers] = useState(users);
  const [sortCriteria, setSortCriteria] = useState({ field: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);

  const handleSort = (event) => {
    const value = event.target.value;
    const [field, direction] = value.split('-');
    setSortCriteria({ field, direction });
  };

  // Fetch clients
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get_clients`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, [setUsers]);

  // Custom order for repair status
  const statusOrder = {
    'Preluat': 1,
    'În curs de reparație': 2,
    'Reparat': 3,
  };

  // Sort users whenever sortCriteria or users change
  useEffect(() => {
    let sortedArray = [...users];
    
    if (sortCriteria.field) {
      sortedArray.sort((a, b) => {
        if (sortCriteria.field === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortCriteria.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortCriteria.field === 'reparation_status') {
          const statusA = statusOrder[a.reparation_status];
          const statusB = statusOrder[b.reparation_status];
          return sortCriteria.direction === 'asc' ? statusA - statusB : statusB - statusA;
        } else if (sortCriteria.field === 'name') {
          const nameA = `${a.first_name} ${a.second_name}`.toLowerCase();
          const nameB = `${b.first_name} ${b.second_name}`.toLowerCase();
          if (nameA < nameB) return sortCriteria.direction === 'asc' ? -1 : 1;
          if (nameA > nameB) return sortCriteria.direction === 'asc' ? 1 : -1;
          return 0;
        } else if (sortCriteria.field === 'id') {
          return sortCriteria.direction === 'asc' ? a.id - b.id : b.id - a.id;
        }
        return 0;
      });
    }

    setSortedUsers(sortedArray);
  }, [sortCriteria, users]);

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!isLoading && users.length === 0) {
    return (
      <Center height="100vh">
        <Text fontSize={"xl"}>
          <Text as={"span"} fontSize={"2xl"} fontWeight={"bold"} mr={2}>
            Baza de date este goală!
          </Text>
          Adaugă un client pentru a începe.
        </Text>
      </Center>
    );
  }

  return (
    <>
    <Container maxW={"100%"} bg={"#1A202C"} >
      {/* Sorting Dropdown */}
      <Box p={4} maxW={"300px"} bg={"#1A202C"} color={"white"} ml={'9'} mt={4}>
            <Select
        placeholder="Sortează după..."
        onChange={handleSort}
        bg={"#1A202C"}
        color={"white"}
        css={css`
          option {
            background-color: #2D3748;  /* Dark background color */
            color: white;               /* White text color */
          }
        `}
      >
        <option value="id-asc">ID crescător</option>
        <option value="id-desc">ID descrescător</option>
        <option value="name-asc">Nume crescător</option>
        <option value="name-desc">Nume descrescător</option>
        <option value="date-asc">Data preluării crescător</option>
        <option value="date-desc">Data preluării descrescător</option>
        <option value="reparation_status-asc">Starea reparației crescător</option>
        <option value="reparation_status-desc">Starea reparației descrescător</option>
      </Select>
      </Box>

      {/* Table Head */}
      <Flex
        justify="space-between"
        align="center"
        p={4}
        bg="gray.700"
        color="white"
        fontWeight="bold"
        textTransform="uppercase"
        fontSize="sm"
        maxW={"93%"}
        mx={"auto"}
      >
        <Box flex="1" minW="100px" textAlign="center">
          ID
        </Box>
        <Box flex="1" minW="100px" textAlign="center">
          Nume
        </Box>
        <Box flex="2" minW="100px" textAlign="center">
          Email
        </Box>
        <Box flex="1" minW="100px" textAlign="center">
          Telefon
        </Box>
        <Box flex="2" minW="100px" textAlign="center">
          Descriere
        </Box>
        <Box flex="1" minW="100px" textAlign="center">
          Starea reparației
        </Box>
        <Box flex="1" minW="100px" textAlign="center">
          Data
        </Box>
        <Box flex="1" minW="100px" textAlign="center">
          Preț
        </Box>
        <Box textAlign="center" w="100px">
          Acțiuni
        </Box>
      </Flex>

      {/* Client Cards */}
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(1, 1fr)",
          lg: "repeat(1, 1fr)",
        }}
        gap={4}
        p={4}
        bg={"#1A202C"}
        
      >
        {sortedUsers.map((user) => (
          <ClientCard user={user} key={user.id} setUsers={setUsers} />
        ))}
      </Grid>
    </Container>
    </>
  );
};

export default ClientGrid;