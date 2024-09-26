import {
  Box,
  Card,
  Flex,
  IconButton,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Center,
} from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { BiTrash, BiEdit, BiPrinter } from 'react-icons/bi';
import EditClient from './EditClient';
import { BASE_URL } from '../App';

const ClientCard = ({ user, setUsers }) => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDeleteClient = async () => {
    try {
      const response = await fetch(BASE_URL + '/delete_client/' + user.id, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      toast({
        status: 'success',
        title: 'Client șters cu succes!🎉',
        description: 'Clientul a fost șters cu succes din baza de date.',
        duration: 2000,
        position: 'top-center',
      });
    } catch (error) {
      toast({
        title: 'A apărut o eroare',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-center',
      });
    } finally {
      setIsOpen(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Preluat':
        return { color: 'red', emoji: '🔴' };
      case 'În curs de reparație':
        return { color: 'yellow', emoji: '🟡' };
      case 'Reparat':
        return { color: 'lightgreen', emoji: '🟢' };
      default:
        return { color: 'gray', emoji: '' };
    }
  };

  const { color, emoji } = getStatusStyles(user.reparation_status);

  const handlePrintClientInfo = () => {
    // Create an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
  
    // Append iframe to the body
    document.body.appendChild(iframe);
  
    // Write the content to the iframe
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(`
      <html>
        <head>
          <title>Client Info</title>
          <style>
            @media print {
              @page {
                margin: 0; /* Remove default margins */
              }
              body {
                margin: 0;
                padding: 0;
                width: 100%;
                -webkit-print-color-adjust: exact; /* Ensure colors are printed accurately */
              }
              .container {
                padding: 30px;
                box-sizing: border-box;
                margin: 0;
                width: 100vw;
                max-width: 800px;
              }
              h1 {
                font-size: 50px;
                margin-bottom: 10px;
                color: #333;
                text-align: center;
              }
              p {
                font-size: 35px;
                margin: 15px 0;
                color: #555;
                text-align: justify;
              }
              .label {
                font-weight: bold;
                color: dark_grey;
              }
              .value {
                color: black;
                text-align: justify;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Informații reparație</h1>
            <p><span class="label">ID:</span> <span class="value">${user.id}</span></p>
            <p><span class="label">Nume:</span> <span class="value">${user.first_name} ${user.second_name}</span></p>
            <p><span class="label">Nr. de telefon:</span> <span class="value">${user.phone_number}</span></p>
            <p><span class="label">Data preluării:</span> <span class="value">${formatDate(user.date)}</span></p>
            <p><span class="label">Preț estimativ:</span> <span class="value">${user.reparation_price} lei</span></p>
            <p><span class="label">Descriere reparație:</span> <span class="value">${user.description}</span></p>
          </div>
        </body>
      </html>
    `);
    iframe.contentWindow.document.close();
  
    // Trigger print on the iframe content
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  
    // Remove the iframe after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
  

  return (
    <>
    
      <Card
        w="95%"  // Adjusted width to slightly enlarge the card
        mx={'auto'}
        borderWidth="1px"
        borderRadius="md"
        overflow="auto"
        boxShadow="sm"
        _hover={{ boxShadow: 'md', transition: '0.2s' }}
        p={4}
        bg='#2D3748'
        minH="60px"
        maxH="600px"
        borderColor={'white'}
      >
        <Flex
          justify="space-between"
          align="center"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
          overflow="hidden"
        >
          {/* ID */}
          <Box flex="1" minW="100px" textAlign="center" flexShrink={1}>
            <Text fontSize="sm" fontWeight="bold" color="white">
              {user.id}
            </Text>
          </Box>

          {/* Name */}
          <Box flex="1" minW="100px" textAlign="center" flexShrink={1} color={'white'}>
            <Text fontSize="md" fontWeight="bold">
              {user.first_name} {user.second_name}
            </Text>
          </Box>

          {/* Email */}
          <Box flex="2" minW="100px" textAlign="center" flexShrink={1}>
            <Text fontSize="sm" color="white">
              {user.email}
            </Text>
          </Box>

          {/* Phone Number */}
          <Box flex="1" minW="100px" textAlign="center" flexShrink={1}>
            <Text fontSize="sm" color="white">
              {user.phone_number}
            </Text>
          </Box>

          {/* Description */}
          <Box flex="2" minW="100px" textAlign="center" flexShrink={1}>
            <Text fontSize="sm" color="white">
              {user.description}
            </Text>
          </Box>

          {/* Repair Status */}
          <Box flex="1" minW="100px" textAlign="center" flexShrink={1}>
            <Text fontSize="sm" color={color}>
              {emoji} {user.reparation_status}
            </Text>
          </Box>

          {/* Date */}
          <Box flex="1" minW="100px" textAlign="center" flexShrink={1}>
            <Text fontSize="sm" color="white" fontWeight="medium">
              {formatDate(user.date)}
            </Text>
          </Box>

          {/* Price */}
          <Box flex="1" minW="100px" textAlign="center" flexShrink={1}>
            <Text fontSize="sm" color="white" fontWeight="medium">
              {user.reparation_price} lei
            </Text>
          </Box>

          {/* Edit, Delete, and Print Icons */}
          <Box textAlign="center" w="100px" mt={{ base: 2, md: 0 }}>
            <Flex justifyContent="center">
              <EditClient user={user} setUsers={setUsers} />
              <IconButton
                variant="ghost"
                colorScheme="red"
                size="sm"
                aria-label="Delete user"
                icon={<BiTrash size={20} />}
                _hover={{ bg: 'red.50', color: 'red.500' }}
                onClick={() => setIsOpen(true)}
              />
              <IconButton
                variant="ghost"
                colorScheme="blue"
                size="sm"
                aria-label="Print user info"
                icon={<BiPrinter size={20} />}
                _hover={{ bg: 'blue.50', color: 'blue.500' }}
                onClick={handlePrintClientInfo}
              />
            </Flex>
          </Box>
        </Flex>
      </Card>

      {/* AlertDialog for delete confirmation */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            maxW="lg"
            borderRadius="md"
            boxShadow="lg"
            borderWidth="2px"
            borderColor="white"
            p={4}
            bg={"#2D3748"} color={'white'}
          >
            <AlertDialogHeader
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              color="white"
              borderRadius="md"
              py={4}
              bg={"#2D3748"}
            >
              🚨 Atenție 🚨
            </AlertDialogHeader>

            <AlertDialogBody fontSize="lg" textAlign="center" p={6} bg={"#2D3748"} color={'white'}>
              Sigur dorești să ștergi toate informațiile asociate acestui client? Această acțiune este ireversibilă.
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center" py={4}>
              <Button
                ref={cancelRef}
                onClick={() => setIsOpen(false)}
                variant="outline"
                colorScheme="gray"
                size="lg"
                mr={3}
                bg={"#2D3748"}
                color={'white'}
              >
                Anulează
              </Button>
              <Button colorScheme="red" onClick={handleDeleteClient} size="lg" ml={3}>
                Șterge
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ClientCard;