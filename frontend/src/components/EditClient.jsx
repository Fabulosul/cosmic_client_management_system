import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useDisclosure,
    InputRightAddon,
    RadioGroup,
    Radio,
    InputGroup
} from "@chakra-ui/react";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css'; // Import the custom CSS
import { ro } from 'date-fns/locale';
import { useToast } from "@chakra-ui/react";
import { BASE_URL } from "../App";
import { format } from 'date-fns';


const EditClient = ({user, setUsers}) => {
    const toast = useToast(); // Initialize the toast hook
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [date, setDate] = useState(new Date(user.date)); // Initialize with the user's date
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState({
      first_name: user.first_name,
      second_name: user.second_name,
      phone_number: user.phone_number,
      email: user.email,
      description: user.description,
      reparation_status: user.reparation_status,
      reparation_price: user.reparation_price,
      date: user.date
    });

    const handleDateChange = (selectedDate) => {
        const formattedDate = selectedDate ? format(selectedDate, 'dd.MM.yyyy') : "";
        setDate(selectedDate); 
        setInputs({ ...inputs, date: formattedDate });
    };

    const handleEditClient = async (e) => {
        e.preventDefault();
        
        // Basic Frontend Validation
        if (!inputs.first_name || !inputs.second_name || !inputs.phone_number || !inputs.date || !inputs.reparation_status || !inputs.description) {
            toast({
                status: "error",
                title: "Formular incomplet!",
                description: "Te rugăm să completezi toate câmpurile obligatorii înainte de a trimite formularul.",
                duration: 2000, // Increased duration for better visibility
                isClosable: true,
                position: "bottom-right", // Position the toast in the bottom-right corner
                variant: "solid", // Solid background color
                style: {
                    backgroundColor: "#e53e3e", // Red color for error
                    color: "white", // White text for contrast
                    borderRadius: "6px", // Rounded corners
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                    padding: "16px", // Add padding for better spacing
                    maxWidth: "30px", // Set maximum width
                    width: "100%", // Ensure it doesn't exceed the max width
                }
            });
            return;
        }

        // Ensure the date is formatted correctly
        const formattedDate = format(date, 'dd.MM.yyyy');
        const updatedInputs = { ...inputs, date: formattedDate };

        setIsLoading(true);

        try {
            const response = await fetch(BASE_URL + "/update_client/" + user.id, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedInputs),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? data : u)));
            toast({
                status: "success",
                title: "Client actualizat cu succes!🎉",
                description: "Clientul a fost actualizat cu succes.",
                duration: 2000,
                position: "top-center",
            });
            onClose();
        } catch (error) {
            toast({
                status: "error",
                title: "A apărut o eroare!",
                description: error.message,
                duration: 4000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <IconButton
                onClick={onOpen}
                variant='ghost'
                colorScheme='blue'
                aria-label='See menu'
                size={"sm"}
                icon={<BiEditAlt size={20} />}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <form onSubmit={handleEditClient} autoComplete='off'>
                    <ModalContent mt="4vh" bg="#2D3748">
                        <ModalHeader color="white">Editează Client</ModalHeader>
                        <ModalCloseButton color="white"/>
                        <ModalBody>
                        <Flex alignItems="center" gap={3}>
                            <FormControl>
                            <FormLabel color="white">Nume</FormLabel>
                            <Input 
                                type="text" 
                                placeholder="Ex: Gheorghe"
                                value={inputs.first_name}
                                onChange={(e) => setInputs({ ...inputs, first_name: e.target.value })}
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
                                onChange={(e) => setInputs({ ...inputs, second_name: e.target.value })}
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
                                onChange={(e) => setInputs({ ...inputs, phone_number: e.target.value })}
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
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
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
                                onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
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
                                onChange={(e) => setInputs({ ...inputs, reparation_price: e.target.value })}
                                bg="#2D3748"
                                color="white"
                                borderColor="#474F5E"
                                />
                                <InputRightAddon bg="#4A5568" color={"white"} borderColor="#474F5E">Lei</InputRightAddon>
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
                            <RadioGroup value={inputs.reparation_status} onChange={(value) => setInputs({ ...inputs, reparation_status: value })} color={"white"}>
                            <Flex gap={5}>
                                <Radio value='Preluat' colorScheme="blue" borderColor={"#4f5765"}>Preluat</Radio>
                                <Radio value='În curs de reparație' colorScheme="blue"  borderColor={"#4f5765"}>În curs de reparație</Radio>
                                <Radio value='Reparat' colorScheme="blue"  borderColor={"#4f5765"}>Reparat</Radio>
                            </Flex>
                            </RadioGroup>
                        </Flex>
                        </ModalBody>

                        <ModalFooter>
                        <Button 
                            mr={3} 
                            type='submit' 
                            isLoading={isLoading}
                            color="black"
                            bg={"#90CDF4"}
                        >
                            Actualizează
                        </Button>
                        <Button color={"white"} bg={"#34756"} onClick={onClose}>Anulează</Button>
                        </ModalFooter>
                    </ModalContent>
                    </form>
                </Modal>
        </>
    );
}

export default EditClient;