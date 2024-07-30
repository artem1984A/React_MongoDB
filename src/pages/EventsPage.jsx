import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Center,
  Container,
  Avatar,
  useBreakpointValue,
} from '@chakra-ui/react';
import { DataContext } from '../contexts/DataContext';

const EventsPage = () => {
  const { events, setEvents, categories, users } = useContext(DataContext);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure to delete event?');
    if (confirmed) {
      try {
        await fetch(`http://localhost:3000/events/${id}`, {
          method: 'DELETE',
        });
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getCategoryNames = (categoryIds) => {
    return categoryIds.map((id) => categories.find((category) => category.id === id)?.name || 'Unknown').join(', ');
  };

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId);
  };

  const stackDirection = useBreakpointValue({ base: 'column', md: 'row' });

  return (
    <Container maxW="container.lg" p={4}>
      <Center>
        <Heading mb={4}>Events</Heading>
      </Center>
      <VStack spacing={6}>
        {events.map((event) => {
          const creator = getUserById(event.createdBy);
          return (
            <Box
              key={event.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              w="100%"
              boxShadow="md"
              backgroundColor="white"
              textAlign="center"
            >
              <Heading size="md" mb={2}>{event.title}</Heading>
              {event.image && (
                <Center>
                  <Image src={event.image} alt={event.title} boxSize={{ base: '100%', md: '300px' }} mb={2} />
                </Center>
              )}
              <Text mb={2}>{event.description}</Text>
              <Text mb={2}>
                {new Date(event.startTime).toLocaleString()} -{' '}
                {new Date(event.endTime).toLocaleString()}
              </Text>
              <Text mb={2}>
                Categories: {event.categoryIds?.length ? getCategoryNames(event.categoryIds) : 'Unknown'}
              </Text>
              {creator && (
                <HStack justifyContent="center" mb={4}>
                  <Avatar size="sm" src={creator.image} name={creator.name} />
                  <Text>Created By: {creator.name}</Text>
                </HStack>
              )}
              <HStack justifyContent="center" spacing={4} direction={stackDirection}>
                <Button as={Link} to={`/events/edit/${event.id}`} colorScheme="blue">
                  Edit
                </Button>
                <Button colorScheme="red" onClick={() => handleDelete(event.id)}>
                  Delete
                </Button>
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </Container>
  );
};

export default EventsPage;