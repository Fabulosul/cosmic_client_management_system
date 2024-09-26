import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import Logo from "./logo.png";
import AddClient from "./AddClient";
import { BASE_URL } from '../App';

const Navbar = ({ setUsers, setAuthenticated }) => {
    const handleLogout = async () => {
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Logout failed");
            }
            setAuthenticated(false);
            localStorage.setItem('auth', 'false');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <Container maxW={"70%"} bg={"#2D3748"} color={"white"} borderRadius={"5px"}>
            <Box px={4} borderRadius={5} bg={"#2D3748"} color={"white"}>
                <Flex h='20' alignItems={"center"} justifyContent={"space-between"}>
                    {/* Left side */}
                    <Flex alignItems={"left"} justifyContent={"left"} gap={3} flex="1">
                        <img src={Logo} alt='Cosmic logo' width={120} height={80} />
                    </Flex>

                    {/* Middle side */}
                    <Flex flex="1" justifyContent={"center"} alignItems={"center"}>
                        <Text fontSize={"lg"} fontWeight={500} color={"white"}>
                            Cosmic IT Computers
                        </Text>
                    </Flex>

                    {/* Right side */}
                    <Flex gap={3} alignItems={"center"} justifyContent={"flex-end"} flex="1">
                        <AddClient setUsers={setUsers} />
                        <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
                    </Flex>
                </Flex>
            </Box>
        </Container>
    );
};

export default Navbar;