import React, { useState } from 'react';
import { Button, Modal, useDisclosure, ModalOverlay, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Flex, FormControl, FormLabel, Input, InputGroup, InputRightAddon, Textarea, RadioGroup, Radio, ModalFooter, useToast } from '@chakra-ui/react';
import { BiAddToQueue } from 'react-icons/bi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css';
import { ro } from 'date-fns/locale';
import { BASE_URL } from '../App';

import { format } from 'date-fns';

const AddClient = ({ setUsers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [date, setDate] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    first_name: "",
    second_name: "",
    phone_number: "",
    email: "",
    description: "",
    reparation_status: "",
    reparation_price: "",
    date: ""
  });

  const resetForm = () => {
    setInputs({
      first_name: "",
      second_name: "",
      phone_number: "",
      email: "",
      description: "",
      reparation_status: "",
      reparation_price: "",
      date: ""
    });
    setDate(null);
  };

  const handleDateChange = (selectedDate) => {
      const formattedDate = selectedDate ? format(selectedDate, 'dd.MM.yyyy') : "";
      setDate(selectedDate);
      setInputs({ ...inputs, date: formattedDate });
  };
  

  const toasts = useToast();

  const handleCreateClient = async (e) => {
    e.preventDefault();
    
    // Basic Frontend Validation
    if (!inputs.first_name || !inputs.second_name || !inputs.phone_number || !inputs.date || !inputs.reparation_status || !inputs.description) { 
      toasts({
        status: "error",
        title: "Formular incomplet!",
        description: "Te rugăm să completezi toate câmpurile obligatorii înainte de a trimite formularul.",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(BASE_URL + '/create_client', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      toasts({
        status: "success",
        title: "Client adăugat cu succes!🎉",
        description: "Clientul a fost adăugat cu succes în baza de date.",
        duration: 2000,
        position: "top-center",
        isClosable: true,
      });

      setUsers(prevUsers => [...prevUsers, data]);
      resetForm();
      onClose();

    } catch (error) {
      toasts({
        status: "error",
        title: "An error occurred.",
        description: error.message,
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} aria-label="Adaugă Client" bg={"#4F5765"} color={'white'} >
        <BiAddToQueue size={20} />
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <form onSubmit={handleCreateClient} autoComplete="off">
          <ModalContent mt="4vh" bg="#2D3748">
            <ModalHeader color="white">Adaugă Client</ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              <Flex alignItems="center" gap={3}>
                <FormControl>
                  <FormLabel color="white">Nume</FormLabel>
                  <Input
                    type="text"
                    placeholder="Ex: Gheorghe"
                    value={inputs.first_name}
                    onChange={(e) =>
                      setInputs({ ...inputs, first_name: e.target.value })
                    }
                    bg="#2D3748"
                    color="white"
                    borderColor="#474F5E"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="white">Prenume</FormLabel>
                  <Input
                    type="text"
                    placeholder="Ex: Marian"
                    value={inputs.second_name}
                    onChange={(e) =>
                      setInputs({ ...inputs, second_name: e.target.value })
                    }
                    bg="#2D3748"
                    color="white"
                    borderColor="#474F5E"
                  />
                </FormControl>
              </Flex>

              <Flex>
                <FormControl mt={4}>
                  <FormLabel color="white">Nr. de telefon</FormLabel>
                  <Input
                    type="text"
                    placeholder="Ex: 0721789735"
                    value={inputs.phone_number}
                    onChange={(e) =>
                      setInputs({ ...inputs, phone_number: e.target.value })
                    }
                    bg="#2D3748"
                    color="white"
                    borderColor="#474F5E"
                  />
                </FormControl>
              </Flex>

              <Flex>
                <FormControl mt={4}>
                  <FormLabel color="white">Email (Opțional)</FormLabel>
                  <Input
                    type="text"
                    placeholder="Ex: cosmicimpex@gmail.com"
                    value={inputs.email}
                    onChange={(e) =>
                      setInputs({ ...inputs, email: e.target.value })}
                    bg="#2D3748"
                    color="white"
                    borderColor="#474F5E"
                  />
                </FormControl>
              </Flex>

              <Flex>
                <FormControl mt={4}>
                  <FormLabel color="white">Descriere reparație</FormLabel>
                  <Textarea
                    resize="vertical"
                    overflow="hidden"
                    placeholder="Ex: Win 10 + șters tot"
                    value={inputs.description}
                    onChange={(e) =>
                      setInputs({ ...inputs, description: e.target.value })
                    }
                    bg="#2D3748"
                    color="white"
                    borderColor="#474F5E"
                  />
                </FormControl>
              </Flex>

              <Flex alignItems="center" gap={3} mt={4}>
                <FormControl>
                  <FormLabel color="white">Preț estimativ (Opțional)</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Ex: 200"
                      value={inputs.reparation_price}
                      onChange={(e) =>
                        setInputs({ ...inputs, reparation_price: e.target.value })
                      }
                      bg="#2D3748"
                      color="white"
                      borderColor="#474F5E"
                    />
                    <InputRightAddon bg="#4A5568" color="white" borderColor="#474F5E">
                      Lei
                    </InputRightAddon>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel color="white">Data preluării produsului</FormLabel>
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="Selectează data"
                    customInput={
                      <Input
                        bg="#2D3748"
                        color="white"
                        borderColor="#474F5E"
                      />
                    }
                    showPopperArrow={false}
                    calendarClassName="custom-datepicker"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    locale={ro}
                  />
                </FormControl>
              </Flex>
              <Flex>
                <FormControl mt={4}>
                  <FormLabel color="white">Status Reparație:</FormLabel>
                </FormControl>
              </Flex>
              <Flex>
                <RadioGroup
                  value={inputs.reparation_status}
                  onChange={(value) =>
                    setInputs({ ...inputs, reparation_status: value })
                  }
                >
                  <Flex gap={5} color="white">
                    <Radio value="Preluat" colorScheme="blue"  borderColor={"#4f5765"}>
                      Preluat
                    </Radio>
                    <Radio value="În curs de reparație" colorScheme="blue"  borderColor={"#4f5765"}>
                      În curs de reparație
                    </Radio>
                    <Radio value="Reparat" colorScheme="blue"  borderColor={"#4f5765"}>
                      Reparat
                    </Radio>
                  </Flex>
                </RadioGroup>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
                Confirmă
              </Button>
              <Button onClick={handleClose} color="white" bg="#4A5568">
                Anulează
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

    </>
  );
};

export default AddClient;
