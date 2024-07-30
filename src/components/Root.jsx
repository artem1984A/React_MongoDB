import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Flex, Link as ChakraLink, Heading, Center } from '@chakra-ui/react';

const Root = () => {
  return (
    <Box p={4}>
      <Flex as="nav" mb={8} justifyContent="space-between" flexDirection={["column", "row"]}>
        <ChakraLink as={Link} to="/" fontWeight="bold" mr={4}>
          Home
        </ChakraLink>
        <ChakraLink as={Link} to="/events" fontWeight="bold" mr={4}>
          Events
        </ChakraLink>
        <ChakraLink as={Link} to="/add-event" fontWeight="bold">
          Add Event
        </ChakraLink>
      </Flex>
      <Center mb={8}>
        <Heading as="h1" fontSize={["2xl", "3xl"]} fontFamily="Georgia, serif">
          Welcome to the Event Manager
        </Heading>
      </Center>
      <Outlet />
    </Box>
  );
};

export default Root;