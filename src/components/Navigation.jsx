import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Link as ChakraLink, Heading } from '@chakra-ui/react';

export const Navigation = () => {
  return (
    <Box as="nav" bg="teal.500" p={4} color="white">
      <Flex justify="space-between" align="center">
        <Heading size="md">Event Manager</Heading>
        <Flex>
          <ChakraLink as={Link} to="/" p={2} _hover={{ textDecoration: 'underline' }}>
            Home
          </ChakraLink>
          <ChakraLink as={Link} to="/events" p={2} _hover={{ textDecoration: 'underline' }}>
            Events
          </ChakraLink>
          <ChakraLink as={Link} to="/add-event" p={2} _hover={{ textDecoration: 'underline' }}>
            Add Event
          </ChakraLink>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;